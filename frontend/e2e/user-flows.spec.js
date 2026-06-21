import { expect, test } from "@playwright/test";

const user = {
  _id: "user-1",
  email: "test@example.com",
};

function reviewItem(id, submittedCode, createdAt, critiquesList = []) {
  return {
    _id: id,
    userId: "user-1",
    submittedCode,
    critiquesList,
    language: "javascript",
    createdAt,
    updatedAt: createdAt,
  };
}

async function mockApi(
  page,
  { authenticated = false, reviews = [], reviewResult = null } = {},
) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname } = url;
    const method = request.method();

    if (pathname === "/api/auth/check" && method === "GET") {
      return route.fulfill({
        status: authenticated ? 200 : 401,
        contentType: "application/json",
        body: JSON.stringify(
          authenticated
            ? user
            : { message: "Unauthorized - No token provided" },
        ),
      });
    }

    if (pathname === "/api/auth/register" && method === "POST") {
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          _id: user._id,
          email: user.email,
          verificationToken: "verification-token",
        }),
      });
    }

    if (pathname === "/api/auth/login" && method === "POST") {
      return route.fulfill({
        status: 200,
        headers: {
          "set-cookie": "jwt=mock-jwt; Path=/; HttpOnly",
        },
        contentType: "application/json",
        body: JSON.stringify(user),
      });
    }

    if (pathname === "/api/auth/logout" && method === "POST") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Logged out successfully" }),
      });
    }

    if (pathname === "/api/auth/forgot-password" && method === "POST") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message:
            "We’ve sent you an email with instructions to reset your password.",
        }),
      });
    }

    if (pathname === "/api/auth/reset-password" && method === "POST") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Password changed successfully." }),
      });
    }

    if (pathname === "/api/review" && method === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(reviews),
      });
    }

    if (pathname === "/api/review" && method === "POST") {
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(
          reviewResult ?? {
            _id: "review-1",
            userId: user._id,
            submittedCode: "const value = 1;",
            language: "javascript",
            critiquesList: [
              { text: "Insecure input handling", category: "security" },
              { text: "Inefficient loop", category: "performance" },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ),
      });
    }

    if (pathname.startsWith("/api/review/") && method === "DELETE") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Review successfully deleted" }),
      });
    }

    if (pathname === "/api/auth/verify-email" && method === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ isVerified: true }),
      });
    }

    return route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({
        message: `Unhandled route: ${method} ${pathname}`,
      }),
    });
  });
}

test("registers a new account and shows the activation screen", async ({
  page,
}) => {
  await mockApi(page, { authenticated: false });

  await page.goto("/register");
  await page.getByLabel("Email Address").fill("new.user@example.com");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Register" }).click();

  await expect(
    page.getByRole("heading", { name: "We sent you an activation link" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Please check your email and click the link to continue using Nitpick.",
    ),
  ).toBeVisible();
});

test("logs in and lands on the dashboard", async ({ page }) => {
  await mockApi(page, { authenticated: false, reviews: [] });

  await page.goto("/login");
  await page.getByLabel("Email Address").fill("test@example.com");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(
    page.getByRole("heading", { name: "Analysis Results" }),
  ).toBeVisible();
  await expect(page.locator("span.text-sm.font-medium.text-white")).toHaveText(
    "test",
  );
  await expect(page.locator("span.text-xs.text-neutral-400")).toHaveText(
    "test@example.com",
  );
  await expect(
    page.getByRole("button", { name: "Analyze Code" }),
  ).toBeVisible();
});

test("resets a forgotten password and returns to the login page", async ({
  page,
}) => {
  await mockApi(page, { authenticated: false });

  await page.goto("/forgot-password");
  await page.getByLabel("Email Address").fill("test@example.com");
  await page.getByRole("button", { name: "Send Reset Link" }).click();

  await page.goto("/reset-password?token=reset-token");
  await page
    .getByLabel("New Password", { exact: true })
    .fill("NewPassword123!");
  await page.getByLabel("Confirm New Password").fill("NewPassword123!");
  await page.getByRole("button", { name: "Reset Password" }).click();

  await expect(
    page.getByRole("heading", { name: "Welcome to Nitpick" }),
  ).toBeVisible();
  await expect(page.url()).toContain("/login");
});

test("submits code for review and renders the analysis results", async ({
  page,
}) => {
  await mockApi(page, {
    authenticated: true,
    reviews: [],
    reviewResult: {
      _id: "review-1",
      userId: user._id,
      submittedCode: "function sum(a, b) { return a + b; }",
      language: "javascript",
      critiquesList: [
        { text: "Insecure input handling", category: "security" },
        { text: "Inefficient loop", category: "performance" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Analysis Results" }),
  ).toBeVisible();

  await page.locator(".monaco-editor").click({ force: true });
  await page.keyboard.type("function sum(a, b) { return a + b; }");
  await page.getByRole("button", { name: "Submit For Review" }).click();

  await expect(page.getByText("2 issues found")).toBeVisible();
  await expect(page.getByText("Insecure input handling")).toBeVisible();
  await expect(page.getByText("Inefficient loop")).toBeVisible();
});

test("loads a history item and deletes it after confirmation", async ({
  page,
}) => {
  await mockApi(page, {
    authenticated: true,
    reviews: [
      reviewItem("review-1", "const latest = 2;", "2026-06-21T10:00:00.000Z", [
        { text: "History issue", category: "bug" },
      ]),
      reviewItem("review-2", "const older = 1;", "2026-06-20T10:00:00.000Z", [
        { text: "Older issue", category: "style" },
      ]),
    ],
  });

  await page.goto("/");
  await expect(page.getByText("const latest = 2;")).toBeVisible();

  await page.getByText("const latest = 2;").click();
  await expect(page.getByText("History issue")).toBeVisible();

  await page.locator("li").first().locator("button").click();
  await expect(
    page.getByRole("heading", {
      name: "Are you sure you want to delete this review?",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete" }).click();

  await expect(page.getByText("const latest = 2;")).toHaveCount(0);
  await expect(page.getByText("const older = 1;")).toBeVisible();
});
