/**
 * ToolIcon.tsx - Dynamic Tool Icon Component
 * 
 * Renders the appropriate Lucide icon based on the tool's iconName.
 * Maps icon name strings to actual Lucide icon components.
 * Falls back to FileText icon if the name isn't found.
 */
import {
  Merge, Scissors, FileDown, Layers, RotateCw, Crop, Trash2, ArrowUpDown, FileOutput,
  FileText, Presentation, Table, Image, Globe, Link, BookOpen, Type, Code, FileCode,
  Ruler, Pen, Mail, Archive, RefreshCw, PenTool, Stamp, Hash, AlignVerticalJustifyStart,
  MessageSquare, Highlighter, FormInput, Lock, Unlock, EyeOff, Shield, Settings,
  ScanLine, FileSearch, Languages, MessageCircle, Wrench, Camera, Eye, FilePlus,
  Maximize, Square, Contrast, ImagePlus, FileUp, FileEdit,
  Youtube, Cloud
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Merge, Scissors, FileDown, Layers, RotateCw, Crop, Trash2, ArrowUpDown, FileOutput,
  FileText, Presentation, Table, Image, Globe, Link, BookOpen, Type, Code, FileCode,
  Ruler, Pen, Mail, Archive, RefreshCw, PenTool, Stamp, Hash, AlignVerticalJustifyStart,
  MessageSquare, Highlighter, FormInput, Lock, Unlock, EyeOff, Shield, Settings,
  ScanLine, FileSearch, Languages, MessageCircle, Wrench, Camera, Eye, FilePlus,
  Maximize, Square, Contrast, ImagePlus, FileUp, FileEdit,
  Youtube, Cloud,
};

interface ToolIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

const ToolIcon = ({ iconName, size = 20, className = "" }: ToolIconProps) => {
  const Icon = iconMap[iconName] || FileText;
  return <Icon size={size} className={className} />;
};

export default ToolIcon;
