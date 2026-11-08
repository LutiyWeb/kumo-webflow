"use client";

import Link from "next/link";
import { useState } from "react";
import { PageMotion } from "@/components/motion/PageMotion";

const iotServices = [
  {
    num: "01",
    title: "Strategic IoT consulting",
    intro:
      "We help enterprises plan and validate high-impact IoT architectures and business cases:",
    bullets: [
      "IoT readiness assessment and roadmap definition",
      "Hardware, sensor, and connectivity selection",
      "Edge and cloud architecture blueprint",
      "ROI modeling and security compliance planning",
    ],
  },
  {
    num: "02",
    title: "Full-cycle IoT development",
    intro: "We support businesses in their IoT development initiatives with:",
    bullets: [
      "Firmware engineering",
      "Data warehouse design and engineering",
      "Data analytics implementation",
      "Custom web and mobile application development (dashboarding, visualization)",
      "Network engineering and implementation",
      "Device and network security testing",
      "API design and provisioning",
      "Application launch",
    ],
  },
  {
    num: "03",
    title: "IoT analytics",
    intro:
      "We turn telemetry streams from connected devices into actionable operational insights:",
    bullets: [
      "Real-time stream processing and anomaly detection",
      "Predictive maintenance models",
      "Interactive KPI dashboards and reporting",
      "Digital twin data modeling",
    ],
  },
  {
    num: "04",
    title: "IoT application management",
    intro:
      "We ensure continuous availability, security, and evolution of your IoT ecosystem:",
    bullets: [
      "24/7 fleet monitoring and OTA firmware updates",
      "Cloud infrastructure scaling and cost optimization",
      "Continuous security auditing and patching",
      "Feature evolution and third-party integrations",
    ],
  },
];

export default function IotSolutionPage() {
  const [openNum, setOpenNum] = useState<string | null>("02");

  return (
    <main className="iot-page" id="top">
      <PageMotion />
      <div className="container">
        <p className="iot-page__crumb" data-reveal="up">
          <Link href="/">Home</Link>
          {"  >  "}
          <Link href="/solutions">Solutions</Link>
          {"  >  Internet Of Things"}
        </p>

        <h1 className="iot-page__title" data-reveal="split" data-reveal-delay="0.1">
          <span className="accent accent--block">Internet</span>
          <span className="iot-page__title-second">of Things</span>
        </h1>

        <hr className="iot-page__rule" data-reveal="line" data-reveal-delay="0.3" />

        <section className="iot-page__intro" data-reveal="stagger" data-reveal-delay="0.3">
          <p className="iot-page__lead">
            <img
              className="iot-page__lead-arrow"
              src="/team/arrow-white.svg"
              alt=""
            />
            Soon there will be trillions of devices/sensors deployed globally.
            What will they power? How will they be secured, connected,
            exploited, managed?
          </p>

          <div className="iot-page__media">
            <img src="/solutions/iot-hover.png" alt="Internet of Things" />
          </div>

          <p className="iot-page__copy">
            Consumer devices are ahead of the curve here however large
            enterprises, governments and healthcare providers are particularly
            behind in regards to deploying and exploiting connectivity. IoT can
            have a variety of application, such as smart utilities, smart homes
            and smart spaces.
          </p>
        </section>

        <section className="iot-page__services">
          <h2 className="iot-page__services-title" data-reveal="split">
            At KUMO we can offer you{" "}
            <span className="accent">the following services,</span> when comes
            to IoT:
          </h2>

          <div className="iot-page__accordion" data-reveal="stagger">
            {iotServices.map((item) => {
              const isOpen = openNum === item.num;
              return (
                <div
                  key={item.num}
                  className={
                    isOpen ? "iot-page__row is-open" : "iot-page__row"
                  }
                >
                  <button
                    type="button"
                    className="iot-page__row-head"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenNum((current) =>
                        current === item.num ? null : item.num,
                      )
                    }
                  >
                    <span className="iot-page__row-num">{item.num}</span>
                    <span className="iot-page__row-title">{item.title}</span>
                    <span className="iot-page__row-icon" aria-hidden="true" />
                  </button>

                  {isOpen && (
                    <div className="iot-page__row-body">
                      <p className="iot-page__row-intro">{item.intro}</p>
                      <ul className="iot-page__bullets">
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className="iot-page__bullet">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
