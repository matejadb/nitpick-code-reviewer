import LogoImage from "/assets/logo.svg";

function Logo({ width, height }) {
  const toRem = (val) => (typeof val === "number" ? `${val * 0.25}rem` : val);
  return (
    <img
      src={LogoImage}
      alt="Nitpick logo"
      style={{ width: toRem(width), height: toRem(height) }}
    />
  );
}

export default Logo;
