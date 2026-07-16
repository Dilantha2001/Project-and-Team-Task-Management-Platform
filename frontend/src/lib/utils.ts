export const getAvatarGradient = (name: string) => {
  if (!name) return "from-indigo-600 to-purple-500";
  const gradients = [
    "from-indigo-500 to-purple-500",
    "from-pink-500 to-rose-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-cyan-500 to-blue-500",
    "from-fuchsia-500 to-pink-500"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

