import Image from "next/image";

export default function AuthIllustration() {
  return (
    <div className="w-full lg:w-2/3">
      <Image
        src="/assets/images/registration.png"
        alt="Registration Illustration"
        width={700}
        height={600}
        sizes="(max-width: 1024px) 100vw, 66vw"
        style={{ width: "100%", height: "auto" }}
        priority={true}
        className="block object-contain"
      />
    </div>
  );
}
