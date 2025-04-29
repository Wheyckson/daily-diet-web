import { Login } from "./login/page";

export default function Home() {
  return (
    <section className="pt-10 w-screen">
      <div className="w-full max-w-screen-md mx-auto px-4 sm:px-6 md:px-8">
        <Login />
      </div>
    </section>
  );
}
