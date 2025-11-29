import wiseGoose from "@/assets/wise-goose-sage.png";

export const WiseGooseAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={wiseGoose}
        alt="Wise Goose AI Sage"
        className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-lg"
      />
    </div>
  );
};
