/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop, Palette, Code, Gauge, Lock, Users } from "lucide-react";
import { VideoCard } from "@/components/ui/aceternity/vedio-card";
import { motion } from "framer-motion";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import BlurIn from "@/components/magicui/blur-in";
import AnimatedImage from "@/components/AnimatedImage";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { BentoGridDemo } from "./_components/HeroBento";
import { FeaturesSectionDemo } from "./_components/HeroBentoMain";
import Navbar from "./_components/Navbar";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { HeroVideo } from "./_components/HeroVideo";
import ShineBorder from "@/components/ui/shine-border";
import Footer from "./_components/footer";


const HomePage = () => {
  const MotionDiv = motion.div;
  const t = useTranslations(); // Hook to access translations

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
    <Navbar isFixed={true} />
    <div className="w-full min-h-screen flex flex-col justify-center bg-white dark:bg-black">
      {/* Hero Section */}
      <main>
        <div className="z-0 relative min-h-screen w-full pb-40 overflow-hidden bg-white dark:bg-[radial-gradient(97.14%_56.45%_at_51.63%_0%,_#7D56F4_0%,_#4517D7_30%,_#000_100%)]">
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(50vw_circle_at_center,black,transparent)] dark:[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]"
            )}
          />
          <MotionDiv
            className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-6 px-4 pt-32"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <BlurIn
                word={t("hero.title")}
                className="font-display text-center text-4xl font-bold text-black dark:text-white w-full lg:w-auto max-w-4xl mx-auto z-10"
                duration={1}
              />
            </motion.div>

            <motion.h2
              className="text-xl text-black dark:text-white text-opacity-60 tracking-normal text-center max-w-2xl mx-auto z-10"
              variants={itemVariants}
            >
              {t("hero.subtitle")}
            </motion.h2>

            <motion.div variants={itemVariants} className="z-20">
              <Link href="/signin">
                <Button className="mb-6">
                  {t("hero.start")}
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              {/* <AnimatedImage
                src="/image.webp"
                alt="Image"
                width={650}
                height={650}
                className="w-full h-auto max-w-6xl mx-auto rounded-2xl shadow-lg"
              /> */}


              <HeroVideo />

            </motion.div>
          </MotionDiv>
        </div>
      </main>

      <div className="flex flex-col gap-16 justify-center items-center w-full mx-auto py-2">
  {/* Bento Grid */}
  <FeaturesSectionDemo />
  <BentoGridDemo />
</div>



      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Card className="relative bg-white dark:bg-stone-950 border overflow-hidden">
        
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        
        <CardContent className="relative p-12 text-center">
          {/* Neon glow effect container */}
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
              {/* Text with neon glow */}
              <span className="relative">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-b from-white to-pink-50">
                  {t("hero.cta.title")}
                </span>
                <span className="absolute inset-0 blur-lg bg-pink-400/10" />
              </span>
            </h2>
            
            <p className="text-pink-50/90 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("hero.cta.description")}
            </p>
            
            <Link href="/signin" className="inline-block">
              <Button
                size="lg"
                className="relative px-8 py-6 text-lg font-medium bg-black hover:bg-black/80 text-white border transition-all duration-300 
                shadow-[0_0_30px_-5px] shadow-pink-500/10 
                hover:shadow-[0_0_30px_-2px] hover:shadow-pink-500/20
                "
              >
                <span className="relative z-10">{t("hero.cta.cta")}</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>

    </div>
    <Footer />
    </>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: any;
  title: any;
  description: any;
}) => (
  <Card className="bg-gray-800/50 border border-gray-800 hover:border-gray-700 transition-colors">
    <CardContent className="p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </CardContent>
  </Card>
);

export default HomePage;
