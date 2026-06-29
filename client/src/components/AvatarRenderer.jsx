import React from "react";
import boxingIcon from "../assets/icons/boxing-svgrepo-com.svg";
import coffeeIcon from "../assets/icons/coffee-svgrepo-com.svg";
import dumbbellIcon from "../assets/icons/dumbbel-svgrepo-com.svg";
import fishIcon from "../assets/icons/fish-svgrepo-com.svg";
import grapeIcon from "../assets/icons/grape-svgrepo-com.svg";
import kiwiIcon from "../assets/icons/kiwi-fruit-svgrepo-com.svg";
import milkIcon from "../assets/icons/milk-svgrepo-com.svg";
import runningIcon from "../assets/icons/running-svgrepo-com.svg";
import scaleIcon from "../assets/icons/weighing-scale-svgrepo-com.svg";
import yogurtIcon from "../assets/icons/yogurt-svgrepo-com.svg";

export default function AvatarRenderer({ name, size = "md", selected = false, className = "" }) {
  const normalizedName = typeof name === "string" ? name.trim() : "";

  let sizeClass = "w-10 h-10 border-2";
  let iconClass = "w-6 h-6";
  if (size === "sm") {
    sizeClass = "w-8 h-8 border-[1.5px]";
    iconClass = "w-5 h-5";
  } else if (size === "lg") {
    sizeClass = "w-14 h-14 border-2 shadow-flat";
    iconClass = "w-9 h-9";
  }

  let badgeColor = "bg-white";

  switch (normalizedName) {
    case "boxing":
      badgeColor = "bg-crimson/20 dark:bg-crimson/10";
      break;
    case "coffee":
      badgeColor = "bg-[#fcd34d]/30 dark:bg-[#fcd34d]/10";
      break;
    case "dumbbell":
      badgeColor = "bg-zinc-200 dark:bg-zinc-800";
      break;
    case "fish":
      badgeColor = "bg-sky-100 dark:bg-sky-950/40";
      break;
    case "grape":
      badgeColor = "bg-purple-100 dark:bg-purple-950/40";
      break;
    case "kiwi":
      badgeColor = "bg-emerald-100 dark:bg-emerald-950/40";
      break;
    case "milk":
      badgeColor = "bg-[#e0f2fe] dark:bg-sky-950/20";
      break;
    case "running":
      badgeColor = "bg-cyberGold/20 dark:bg-cyberGold/10";
      break;
    case "scale":
      badgeColor = "bg-slate-100 dark:bg-slate-800";
      break;
    case "yogurt":
      badgeColor = "bg-cyberGreen/20 dark:bg-cyberGreen/10";
      break;
    default:
      badgeColor = "bg-zinc-100 dark:bg-zinc-800";
      break;
  }

  const getIconUrl = () => {
    switch (normalizedName) {
      case "boxing":
        return boxingIcon;
      case "coffee":
        return coffeeIcon;
      case "dumbbell":
        return dumbbellIcon;
      case "fish":
        return fishIcon;
      case "grape":
        return grapeIcon;
      case "kiwi":
        return kiwiIcon;
      case "milk":
        return milkIcon;
      case "running":
        return runningIcon;
      case "scale":
        return scaleIcon;
      case "yogurt":
        return yogurtIcon;
      default:
        return coffeeIcon;
    }
  };

  return (
    <div className={`rounded-2xl border-black flex items-center justify-center shrink-0 transition-all ${badgeColor} ${sizeClass} ${selected ? "shadow-flat -translate-x-[2px] -translate-y-[2px]" : ""} ${className}`}>
      <img src={getIconUrl()} className={iconClass} alt={normalizedName} />
    </div>
  );
}
