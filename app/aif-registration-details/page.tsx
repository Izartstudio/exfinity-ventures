import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { PreFooter } from "@/components/sections/pre-footer";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "AIF Registration Details",
  description: "SEBI registration and scheme details for Exfinity Technology Fund.",
  path: "/aif-registration-details",
});

export default function AifRegistrationDetailsPage() {
  return <>
    <main>
      <section className="aif-details" aria-labelledby="aif-details-title">
        <div className="container">
          <div className="aif-details-layout">
            <h1 id="aif-details-title">AIF Registration Details</h1>
            <dl className="aif-details-list">
              <div><dt>Name of AIF</dt><dd>Exfinity Technology Fund</dd></div>
              <div><dt>Name of Investment Manager</dt><dd>Exfinity Venture Partners LLP</dd></div>
              <div><dt>SEBI registration number</dt><dd>IN/AIF1/13-14/0094 dated February 07, 2014</dd></div>
              <div><dt>Category of AIF</dt><dd>Category I AIF (Venture Capital Fund)</dd></div>
              <div className="aif-schemes">
                <dt>Name of the Schemes</dt>
                <dd><ol aria-label="AIF schemes">
                  <li>Exfinity Technology Fund – Series I</li>
                  <li>Exfinity Technology Fund – Series II</li>
                  <li>Exfinity Technology Fund – Series III</li>
                </ol></dd>
              </div>
              <div><dt>Name of the Compliance Officer</dt><dd>Chinnu Senthilkumar</dd></div>
            </dl>

            <h2 className="aif-fund-title">Exfinity India Fund</h2>
            <dl className="aif-details-list aif-details-list-secondary">
              <div><dt>Name of AIF</dt><dd>Exfinity India Fund</dd></div>
              <div><dt>Name of Investment Manager</dt><dd>Exfinity Investment Manager LLP</dd></div>
              <div><dt>SEBI registration number</dt><dd>IN/AIF2/25-26/2093 dated March 12, 2026</dd></div>
              <div><dt>Category of AIF</dt><dd>Category II AIF (Venture Capital Fund)</dd></div>
              <div className="aif-schemes">
                <dt>Name of the Schemes</dt>
                <dd>Exfinity India Fund I</dd>
              </div>
              <div><dt>Name of the Compliance Officer</dt><dd>Jesper Ludolph</dd></div>
            </dl>
          </div>
        </div>
      </section>
      <PreFooter />
    </main>
    <Footer />
  </>;
}
