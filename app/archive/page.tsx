import { redirect } from "next/navigation";
/** Preserve a discoverable archive URL without duplicating indexed work content. */
export default function ArchivePage() { redirect("/work"); }
