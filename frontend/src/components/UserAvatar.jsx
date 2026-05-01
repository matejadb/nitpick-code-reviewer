import { AVATAR_COLOURS } from "../constants/AVATAR_COLOURS";

export function UserAvatar({ email }) {
  const letter = email[0].toUpperCase();
  const color = AVATAR_COLOURS[email.charCodeAt(0) % AVATAR_COLOURS.length];
  return (
    <div
      className={`${color} flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white`}
    >
      {letter}
    </div>
  );
}
