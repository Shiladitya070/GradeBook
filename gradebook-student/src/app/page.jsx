import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1>Student</h1>
      <Link className="bg-red-400 p-4" href="/asg" >Asg</Link>
    </main>
  );
}
