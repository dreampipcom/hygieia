// signin/page.tsx TS-Doc?
"use server";

export default async function Error() {
  return (
    <main>
      <article>
        <img src="/logo.svg" />
        <p>There was an error logging you in.</p>
        <p>
          Please be patient, this is still an Alpha release and not official.
        </p>
      </article>
    </main>
  );
}
