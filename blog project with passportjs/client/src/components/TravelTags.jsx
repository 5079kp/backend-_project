import { motion } from "framer-motion";

const tags = [
  { label: "Adventure", emoji: "🏔️", color: "#f59e0b" },
  { label: "Beach", emoji: "🏖️", color: "#06b6d4" },
  { label: "Mountains", emoji: "⛰️", color: "#10b981" },
  { label: "Culture", emoji: "🏛️", color: "#8b5cf6" },
  { label: "Food", emoji: "🍜", color: "#f43f5e" },
  { label: "Road Trips", emoji: "🚗", color: "#6366f1" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const TravelTags = () => {
  return (
    <motion.div
      className="travel-tags"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {tags.map((tag) => (
        <motion.span
          key={tag.label}
          className="travel-tag"
          variants={item}
          whileHover={{
            scale: 1.1,
            boxShadow: `0 0 20px ${tag.color}44`,
            borderColor: tag.color,
          }}
          style={{ "--tag-color": tag.color }}
        >
          <span className="tag-emoji">{tag.emoji}</span>
          <span className="tag-label">{tag.label}</span>
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TravelTags;
