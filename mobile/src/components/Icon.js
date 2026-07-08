import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export function Icon({ name, size = 22, color = theme.inkM, ...props }) {
  return <Ionicons name={name} size={size} color={color} {...props} />;
}
