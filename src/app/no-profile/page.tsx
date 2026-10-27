import Image from "next/image";
import Link from "next/link";

export default function NoProfilePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow">
        <Image
          src="/images/amni-logo.png"
          alt="Amni logo"
          width={140}
          height={50}
          className="mx-auto"
        />
        <h1 className="mt-6 text-xl font-semibold">Amni Portal</h1>
        <h2 className="mt-2 font-medium text-red-600">Profile Error</h2>
        <div className="mt-4 space-y-3 text-left text-sm text-gray-700">
          <p>
            There seems to be a problem with your profile on this app. This issue will prevent you
            from completing the task you were performing.
          </p>
          <p>
            Please contact the ICT Department at{" "}
            <a className="text-brand underline" href="mailto:appdev@amni.com">
              appdev@amni.com
            </a>{" "}
            to resolve this issue.
          </p>
        </div>
        <Link href="/home" className="mt-6 inline-block text-xs font-medium uppercase text-brand">
          Back home
        </Link>
      </div>
    </div>
  );
}
