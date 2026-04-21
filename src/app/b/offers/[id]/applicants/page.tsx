import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

// The offer detail page already lists applicants. This route exists so
// notifications can deep-link to /b/offers/{id}/applicants — we redirect
// back to the unified detail page.
export default async function ApplicantsRedirectPage({ params }: Props) {
  const { id } = await params;
  redirect(`/b/offers/${id}#applicants`);
}
