const Logo = () => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "18px",
        fontWeight: 600,
        color: "#7c3aed",
        padding: "20px 0"
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "4px",
          border: "2px solid #7c3aed",
        }}
      ></div>
      <span style={{ fontSize: "500" }}>LOGO</span>
    </div>
  );
};

export default Logo;
