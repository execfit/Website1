"use client"

import { useEffect } from "react"
import Header from "@/components/header"

export default function WaiverPage() {
  // Simple scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="execfit-main">
      <Header />

      {/* Background Elements */}
      <div className="bg-container">
        <div className="execfit-bg-animation">
          <div className="bg-space-gradient"></div>
          <div className="bg-grid-lines bg-horizontal"></div>
          <div className="bg-grid-lines bg-vertical"></div>
          <div className="bg-gradient-grid-top"></div>

          {/* Static stars - Desktop only */}
          <div className="static-stars-container desktop-only">
            <div className="bg-star bg-star-1"></div>
            <div className="bg-star bg-star-2"></div>
            <div className="bg-star bg-star-3"></div>
            <div className="bg-star bg-star-4"></div>
            <div className="bg-star bg-star-5"></div>
            <div className="bg-star bg-star-6"></div>
            <div className="bg-star bg-star-7"></div>
            <div className="bg-star bg-star-8"></div>
          </div>

          {/* Mobile particles */}
          <div className="mobile-particles-container mobile-only">
            {Array.from({ length: 25 }, (_, i) => (
              <div key={i} className={`mobile-particle mp-${i + 1}`}></div>
            ))}
          </div>

          {/* Animated elements */}
          <div className="bg-floating-element bg-circle-1"></div>
          <div className="bg-floating-element bg-circle-2"></div>
          <div className="bg-floating-element bg-square"></div>
          <div className="bg-floating-element bg-circle-3"></div>
          <div className="bg-floating-element bg-square-2"></div>
          <div className="bg-pulse-circle"></div>
          <div className="bg-pulse-circle bg-pulse-circle-2"></div>
          <div className="bg-light-beam"></div>
          <div className="bg-light-beam bg-light-beam-2"></div>
          <div className="bg-scan-lines"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="execfit-homepage">
          <section className="py-8 md:py-20">
            <div className="execfit-container">
              {/* Page Header */}
              <div className="text-center mb-8 md:mb-12">
                <h1 className="execfit-section-title execfit-title-glow text-3xl md:text-4xl mb-4">
                  Client Waiver and Release of Liability
                </h1>
                <p className="execfit-raleway-text execfit-black-glow text-lg max-w-3xl mx-auto">
                  Complete Legal Document - ExecFit Inc.
                </p>
              </div>

              {/* Waiver Content */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8">
                  {/* Introduction */}
                  <div className="mb-8">
                    <p className="text-white/90 leading-relaxed text-base md:text-lg">
                      This Waiver and Release of Liability ("Waiver") is entered into by the undersigned client
                      ("Client") in consideration for receiving personal training, fitness coaching, or wellness
                      services ("Services") provided by <strong className="text-white">EXECFIT INC</strong>, a
                      Massachusetts S-Corporation ("Company").
                    </p>
                  </div>

                  {/* Section 1 */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 execfit-title-glow">
                      1. Acknowledgment of Risks
                    </h2>
                    <p className="text-white/90 leading-relaxed mb-4">
                      I understand and acknowledge that participation in physical training and wellness programs
                      involves inherent risks, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside text-white/90 leading-relaxed space-y-2 ml-4">
                      <li>Muscle strains, sprains, and tears</li>
                      <li>Cardiovascular events (e.g., elevated heart rate, blood pressure issues)</li>
                      <li>Injuries from equipment use or gym environment</li>
                      <li>Aggravation of pre-existing medical conditions</li>
                      <li>Serious bodily injury or, in rare cases, death</li>
                    </ul>
                    <p className="text-white/90 leading-relaxed mt-4">
                      I knowingly and voluntarily accept all such risks, whether identified or not.
                    </p>
                  </div>

                  {/* Section 2 */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 execfit-title-glow">
                      2. Medical Clearance
                    </h2>
                    <p className="text-white/90 leading-relaxed">
                      I affirm that I am in good physical condition and do not suffer from any condition or impairment
                      that would prevent or limit my participation in physical activities. I have consulted with a
                      physician or chosen not to seek medical clearance at my own discretion. I agree to inform Company
                      of any changes in my health that may affect my ability to participate safely.
                    </p>
                  </div>

                  {/* Section 3 */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 execfit-title-glow">
                      3. Voluntary Participation
                    </h2>
                    <p className="text-white/90 leading-relaxed">
                      I understand that my participation in Company's services is entirely voluntary. I may stop
                      participation or request modifications at any time. I am solely responsible for listening to my
                      body and working within my own limits.
                    </p>
                  </div>

                  {/* Section 4 */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 execfit-title-glow">
                      4. Assumption of Responsibility
                    </h2>
                    <p className="text-white/90 leading-relaxed mb-4">I assume full responsibility for:</p>
                    <ul className="list-disc list-inside text-white/90 leading-relaxed space-y-2 ml-4 mb-4">
                      <li>My physical condition and capabilities</li>
                      <li>Selecting appropriate levels of effort during sessions</li>
                      <li>Following safety instructions provided by Company trainers</li>
                    </ul>
                    <p className="text-white/90 leading-relaxed">
                      I understand that results may vary and that no guarantees are made regarding fitness improvements,
                      weight loss, or other health outcomes.
                    </p>
                  </div>

                  {/* Section 5 */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 execfit-title-glow">
                      5. Waiver and Release
                    </h2>
                    <p className="text-white/90 leading-relaxed mb-4">
                      In consideration for receiving services from Company, I hereby waive, release, and discharge
                      Company, its owners, officers, employees, independent contractors, affiliates, agents, and
                      property partners from any and all liability, claims, or causes of action arising out of or
                      related to:
                    </p>
                    <ul className="list-disc list-inside text-white/90 leading-relaxed space-y-2 ml-4 mb-4">
                      <li>Personal injury or property damage</li>
                      <li>Death</li>
                      <li>Claims arising from negligence (excluding gross negligence or willful misconduct)</li>
                    </ul>
                    <p className="text-white/90 leading-relaxed">
                      This release extends to any incidents occurring at residential buildings, gyms, parks, virtual
                      platforms, or other locations where Company services may be provided.
                    </p>
                  </div>

                  {/* Section 6 */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 execfit-title-glow">
                      6. Indemnification
                    </h2>
                    <p className="text-white/90 leading-relaxed">
                      I agree to indemnify and hold harmless Company and all associated parties from any claims,
                      liabilities, or expenses (including attorney's fees) resulting from my participation in Company
                      services or use of facilities, equipment, or platforms.
                    </p>
                  </div>

                  {/* Section 7 */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 execfit-title-glow">
                      7. Governing Law
                    </h2>
                    <p className="text-white/90 leading-relaxed">
                      This Waiver shall be governed by and construed in accordance with the laws of the Commonwealth of
                      Massachusetts.
                    </p>
                  </div>

                  {/* Section 8 */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 execfit-title-glow">
                      8. Severability
                    </h2>
                    <p className="text-white/90 leading-relaxed">
                      If any portion of this Waiver is held to be invalid or unenforceable, the remainder shall remain
                      in full force and effect.
                    </p>
                  </div>

                  {/* Section 9 */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 execfit-title-glow">
                      9. Dispute Resolution and Arbitration
                    </h2>
                    <p className="text-white/90 leading-relaxed mb-4">
                      I agree that any dispute, claim, or controversy arising out of or relating to this Waiver or the
                      Services provided by Company shall be resolved exclusively by final and binding arbitration in
                      Suffolk County, Massachusetts, in accordance with the rules of the American Arbitration
                      Association. The costs of arbitration, including arbitrator fees and administrative expenses,
                      shall be shared equally between Company and Client, provided that such cost-sharing does not
                      render arbitration prohibitively expensive for Client. In such cases, fees may be adjusted in
                      accordance with applicable law or at the discretion of the arbitrator. Each party shall be
                      responsible for their own legal fees.
                    </p>
                    <p className="text-white/90 leading-relaxed font-medium">
                      By agreeing to arbitration, I understand that I am waiving my right to a trial by jury or to
                      participate in any class or representative action.
                    </p>
                  </div>

                  {/* Footer Notice */}
                  <div className="mt-12 pt-8 border-t border-white/20">
                    <div className="bg-white/5 rounded-lg p-6 text-center">
                      <p className="text-white/80 text-sm leading-relaxed">
                        <strong className="text-white">Important:</strong> This is the complete legal waiver document.
                        Please read carefully and ensure you understand all terms before agreeing to services.
                      </p>
                      <p className="text-white/60 text-xs mt-3">
                        Document effective as of the date of service agreement with ExecFit Inc.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
