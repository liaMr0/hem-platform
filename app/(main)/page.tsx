import HeroSection from "@/components/landing-page/hero-section"
import FeaturesSection from "@/components/landing-page/features-section"
import FaqSection from "@/components/landing-page/faq-section"
import TestimonialsSection from "@/components/landing-page/testimonials-section"
import ResourcesSection from "@/components/landing-page/resources-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen ">
      <HeroSection/>
      <FeaturesSection/>
      <ResourcesSection/>
      <TestimonialsSection/>
      <FaqSection/>
    </div>
  )
}





