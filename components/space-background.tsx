export function SpaceBackground() {
  return (
    <>
      <div className="starfield fixed inset-0 z-0" />
      <div className="nebula-gradient fixed inset-0 z-0" />
      <div className="shooting-star" style={{ top: "10%", left: "10%", animationDelay: "0s" }} />
      <div className="shooting-star" style={{ top: "50%", left: "30%", animationDelay: "2s" }} />
      <div className="shooting-star" style={{ top: "80%", left: "60%", animationDelay: "4s" }} />
    </>
  )
}
