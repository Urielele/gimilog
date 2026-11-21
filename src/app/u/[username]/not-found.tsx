import { TextLink } from "@/components/gm";

export default function ProfileNotFound() {
  return (
    <div>
      <h2 className="text-[24px] leading-[1.2] font-bold text-ink">
        Profile not found.
      </h2>
      <p className="mt-2 text-[16px] leading-[1.4] text-text-soft">
        This username does not exist. <TextLink href="/">Back to home</TextLink>
      </p>
    </div>
  );
}
