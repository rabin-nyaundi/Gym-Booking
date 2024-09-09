import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-between bg-primary p-4 lg:p-24">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      <Image
        className="absolute inset-0 z-0"
        src={"/images/backgroundt.jpeg"}
        alt={"technogym"}
        fill
        style={{ objectFit: "cover" }}
      />
      <div className="relative z-50 flex h-full w-full items-center justify-center text-base ">
        <div className="flex flex-col w-full lg:w-auto gap-10">
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-4xl text-center md:text-5xl lg:text-7xl font-bold text-white">
              Commit to Be Fit
            </h2>
            <span className="text-center text-xl md:text-2xl lg:text-4xl text-white">
              Book a Session.
            </span>
          </div>
          <div className="flex justify-center gap-4 lg:gap-8">
            <Button className="bg-[#ff9f1c]  px-5 lg:px-10 font-bold rounded-full text-black hover:text-white">
              <Link href={"/auth/register"}> Get Started!</Link>
            </Button>

            <Button
              className="bg-transparent border border-[#ff9f1c] hover:border-primary hover:bg-primary rounded-full font-bold text-white  px-5 lg:px-10 hover:text-white"
              variant={"outline"}
            >
              <Link href={"/auth/login"}>Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
