import { useState } from "react";
import { Star } from "lucide-react";

export default function FavoriteButton() {
  const [fav, setFav] = useState(false);

  return (
    <button
      onClick={() => setFav(!fav)}
      className={`
        transition-all duration-300
        hover:scale-110 active:scale-90
        ${fav ? "text-yellow-300" : "text-gray-400"}
      `}
      title={fav ? "remover dos favoritos" : "adicionar aos favoritos"}
    >
      <Star
        size={20}
        strokeWidth={2.3}
        className={fav ? "fill-yellow-300" : "fill-transparent"}
      />
    </button>
  );
}
