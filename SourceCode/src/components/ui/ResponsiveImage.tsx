import Image, { StaticImageData } from "next/image";

interface ResponsiveImageProps {
  imageSrc: StaticImageData;
  altImage: string;
  additionClass?: string;
  imageWidth: number;
  imageHeight: number;
  fill?: boolean;
  priority?: boolean;
}

export default function ResponsiveImage({
  imageSrc,
  altImage,
  additionClass,
  imageWidth,
  imageHeight,
  fill,
  priority,
}: ResponsiveImageProps) {
  return (
    <Image
      src={imageSrc}
      alt={altImage}
      className={additionClass}
      width={imageWidth}
      height={imageHeight}
      fill={fill}
      priority={priority}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
