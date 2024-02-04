/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "classnames";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

const Nav = () => {
  const links = [
    { path: "/", name: "home" },
    { path: "/projects", name: "projects" },
    { path: "/contact", name: "contact" },
  ];
  const pathname = usePathname();
  const MotionLink = motion(Link);

  const mapRange = (
    inputLower: number,
    inputUpper: number,
    outputLower: number,
    outputUpper: number
  ) => {
    const INPUT_RANGE = inputUpper - inputLower;
    const OUTPUT_RANGE = outputUpper - outputLower;
    return (value: number) =>
      outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0);
  };

  const setTransform = (
    item: HTMLElement & EventTarget,
    event: React.PointerEvent,
    x: MotionValue,
    y: MotionValue
  ) => {
    const bounds = item.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const relativeY = event.clientY - bounds.top;
    const xRange = mapRange(0, bounds.width, -1, 1)(relativeX);
    const yRange = mapRange(0, bounds.height, -1, 1)(relativeY);
    x.set(xRange * 10);
    y.set(yRange * 10);
  };

  return (
    <nav className="p-8">
      <ul className="flex gap-12">
        <AnimatePresence>
          {links.map(({ name, path }) => {
            const x = useMotionValue(0);
            const y = useMotionValue(0);
            const textX = useTransform(x, (latest) => latest * 2);
            const textY = useTransform(x, (latest) => latest * 2);
            return (
              <motion.li
                onPointerMove={(event) => {
                  const item = event.currentTarget;

                  setTransform(item, event, x, y);
                }}
                onPointerLeave={() => {
                  x.set(0);
                  y.set(0);
                }}
                style={{ x, y }}
                key={path}
              >
                <MotionLink
                  className={cn(
                    "font-medium relative rounded-md text-sm py-2 px-4 transition-all duration-500 ease-out hover:bg-slate-200",
                    pathname === path && "bg-slate-300"
                  )}
                  href={path}
                >
                  <motion.span
                    style={{ x: textX, y: textY }}
                    className="relative z-10"
                  >
                    {name}
                  </motion.span>
                  {pathname === path && (
                    <motion.div
                      transition={{ type: "spring" }}
                      layout
                      layoutId="underline"
                      className="absolute w-full h-full rounded-md left-0 bottom-0 bg-blue-300"
                    ></motion.div>
                  )}
                </MotionLink>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </nav>
  );
};

export default Nav;
