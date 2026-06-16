import {
  BookOpen, Coffee, Footprints, Plane, Laptop, UtensilsCrossed,
  Dumbbell, BookOpenText, BatteryMedium, Zap, Sun, BadgeCheck,
  MapPin, ShieldAlert, Globe, Star, ShieldCheck, Sparkle, Ban,
  Target, Home, Cloud, User, CloudSun, Sprout, Leaf, Moon,
  Sparkles, Flame, Handshake, Check, Timer, Plus
} from 'lucide-react';

// Map of emoji → Lucide icon component
const iconMap = {
  '📚': BookOpen,
  '☕': Coffee,
  '🏃': Footprints,
  '✈': Plane,
  '💻': Laptop,
  '🍽': UtensilsCrossed,
  '🏋': Dumbbell,
  '📖': BookOpenText,
  '🔋': BatteryMedium,
  '⚡': Zap,
  '🔆': Sun,
  '🪪': BadgeCheck,
  '📍': MapPin,
  '🆘': ShieldAlert,
  '🌐': Globe,
  '⭐': Star,
  '🛡': ShieldCheck,
  '✦': Sparkle,
  '🚫': Ban,
  '◎': Target,
  '⌂': Home,
  '☁': Cloud,
  '○': User,
  '🌤': CloudSun,
  '🌱': Sprout,
  '🌿': Leaf,
  '🌙': Moon,
  '✨': Sparkles,
  '🔥': Flame,
  '🤝': Handshake,
  '✓': Check,
  '⏱': Timer,
  '＋': Plus,
};

/**
 * Inline icon component — replaces emoji with a Lucide icon
 * @param {string} name - emoji character or keyword
 * @param {number} size - icon size (default 14)
 * @param {string} className - optional CSS class
 */
export default function Icon({ name, size = 14, className = '' }) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return <span>{name}</span>;
  return (
    <IconComponent
      size={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
}

// Named exports for direct use
export {
  BookOpen, Coffee, Footprints, Plane, Laptop, UtensilsCrossed,
  Dumbbell, BookOpenText, BatteryMedium, Zap, Sun, BadgeCheck,
  MapPin, ShieldAlert, Globe, Star, ShieldCheck, Sparkle, Ban,
  Target, Home, Cloud, User, CloudSun, Sprout, Leaf, Moon,
  Sparkles, Flame, Handshake, Check, Timer, Plus
};
