// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System.Security.Cryptography.X509Certificates;
using Microsoft.EntityFrameworkCore;

namespace CoreII.Data.SeedData;

public static class Seeder
{
    public static void Initialize(PortalContext context)
    {
        // context.Database.EnsureCreated();
        // if (!context.Applications.Any())
        // {
        //     var applications = new List<Application>();
        //     applications.Add(new Application
        //     {
        //         ApplicationName = "BAM",
        //         ApplicationUrl = "https://github.inl.gov/CyOTE/Bayesian-Attack-Model",
        //         ApplicationSourceUrl = "https://github.inl.gov/CyOTE/Bayesian-Attack-Model",
        //         Tlr = 1,
        //         ApplicationIcon = "cyotelogo.png",
        //         TextData =
        //             "BAM applies Bayesian inference methods to calculate the likelihood of adversarial techniques, tactics, and behaviors given observed evidence. Techniques and tactics are defined using the MITRE ATT&CK\u00ae for ICS framework, and adversary behavior phases are defined as high-level characterizations of the progress of an attack. By using BAM, OT professionals can better identify and characterize adversarial behavior in their systems to enable risk-informed investigations and interruptions before impact occurs.",
        //         TextHelps =
        //             "BAM aids in strategic decision-making by estimating the likelihood of different stages of adversarial behavior. BAM serves as a platform to break down organizational information silos by aggregating evidence across the observer experiences of various OT roles and responsibilities. This enables security teams to prioritize resources and responses effectively, focusing on the most probable threats at any given time.",
        //         TextSummary =
        //             "BAM enhances OT security by using Bayesian inference and MITRE ATT&CK\u00ae for ICS to estimate the likelihood of adversarial behaviors based on observed evidence.",
        //         TextWorks =
        //             "The Bayesian Attack Model (BAM) is an analytical tool designed to enhance the comprehension of adversarial activity in OT environments. BAM leverages both expert cybersecurity insights and historical data to characterize the likelihood of adversarial behavior given anomalous observable events."
        //     });
        //     applications.Add(new Application
        //     {
        //         ApplicationName = "CATCH",
        //         ApplicationUrl = "https://github.inl.gov/CyOTE/CATCH",
        //         ApplicationSourceUrl = "https://github.inl.gov/CyOTE/CATCH",
        //         Tlr = 1,
        //         ApplicationIcon = "OPTICLogoEye.svg",
        //         TextData =
        //             "CATCH collects, stores, analyzes, and creates STIX reports on anomalous data. CATCH gathers telemetry data, stores it in a Neo4j database, queries the database for MITRE ICS ATT&CK patterns, and creates STIX 2.1 reports.",
        //         TextHelps =
        //             "CATCH connects the CyOTE analysis framework together with the MITRE ICS ATT&CK patterns and highlights areas of improvement and further research.  CATCH can used for monitoring network traffic and command line activities for immediate threat alerts, can be used to correlate data across systems for quick response, and automate threat data sharing via STIX objects.",
        //         TextSummary =
        //             "CATCH enhances security controls by using Collection Engines and Analysis Modules to gather, analyze, and report anomalous telemetry data, correlating it with MITRE ICS ATT&CK patterns.",
        //         TextWorks =
        //             "CATCH is designed to enhance an organization’s security controls by providing a structured approach to collecting, storing, analyzing, and reporting anomalous data. This framework capitalizes on two key toolsets: Collection Engines and Analysis Modules. These engines and modules are specialized for gathering and analyzing telemetry data from diverse sources to detect patterns that might indicate a cyber attack."
        //     });
        //     applications.Add(new Application
        //     {
        //         ApplicationName = "Insights",
        //         ApplicationUrl = "https://github.inl.gov/CyOTE/Executive-Dashboard",
        //         ApplicationSourceUrl = "https://github.inl.gov/CyOTE/Executive-Dashboard",
        //         Tlr = 1,
        //         ApplicationIcon = "OPTICLogoEye.svg",
        //         TextData =
        //             "<ul><li style='padding-bottom:10px'><b>Historical Data Insights:</b> A retrospective look at financial implications, attack vectors, and the evolution of cyber threats.</li><li style='padding-bottom:10px'><b>Advanced Observables and Techniques:</b> Detailed breakdowns of cyber attack signatures and methodologies.</li><li style='padding-bottom:10px'><b>Threat Intelligence Estimation Support:</b> Leverage Bayesian models and Machine Learning (ML) analysis to anticipate and mitigate potential cyber threats.</li><li style='padding-bottom:10px'><b>Live OT Dashboard:</b> Stay ahead with a dynamic interface that reflects real-time data, enabling immediate recognition and response to active cyber threats.</li><li style='padding-bottom:10px'><b>Financial Impact Projections:</b> Utilize predictive analytics to estimate potential financial repercussions and streamline your cybersecurity investment strategy.</li></ul>",
        //         TextHelps =
        //             "CATCH connects the CyOTE analysis framework together with the MITRE ICS ATT&CK patterns and highlights areas of improvement and further research.  CATCH can used for monitoring network traffic and command line activities for immediate threat alerts, can be used to correlate data across systems for quick response, and automate threat data sharing via STIX objects.",
        //         TextSummary =
        //             "COREII Insights enhances CISO-executive communication and decision-making in OT cybersecurity by providing actionable data from historical analysis, real-time dashboards, and predictive analytics.",
        //         TextWorks =
        //             "Insights will help enhance communication for strategic alignment through empowering proactic and informed decision making."
        //     });
        //     applications.Add(new Application
        //     {
        //         ApplicationName = "OPTIC",
        //         ApplicationUrl = "http://csetac.inl.gov:5100/home/login",
        //         ApplicationSourceUrl = "https://github.inl.gov/CyOTE/OPTIC",
        //         Tlr = 1,
        //         ApplicationIcon = "CyOTE_logo_23-0807_nostars.svg",
        //         TextData =
        //             "<p style='padding-bottom:10px'>CyOTE offers a suite of tools designed to fortify your OT systems and empower your organization. These resources are the result of a trusted team from CESER and National Lab cybersecurity experts with years of research experience securing OT environments. </p><ul><li style='padding-bottom:10px'><b>Situational Awareness:</b> Identify gaps in knowledge about adversarial behavior leveraging MITRE ATT&CK for Industrial Control Systems (ICS).</li><li style='padding-bottom:10px'><b>Improve Maturity:</b> Govern your business goals with cybersecurity maturity goals aligned with Cybersecurity Capability Maturity Model (C2M2).</li><li style='padding-bottom:10px'><b>Micro-Baselining:</b> Prioritize understanding normal conditions on critical systems and implement countermeasures aligned with National Institute of Standards and Technology (NIST) Cybersecurity Framework to limit damage and resume operations quickly in case of an attack.</li><li style='padding-bottom:10px'><b>Iterative Investigation:</b> Detect through continuous monitoring and assessment of OT infrastructure activity to identify threats before loss of ICS control or disruption of business operations.</li><li><b>Tools & Training:</b> Engage in our purpose built tooling to parse through 13,000 + observable items and over 3,000 pages of data rich material to systematically inform and evolve OT Cybersecurity, coupled with training products that evolve diversified teams to identify anomalous behavior within a control process.</li></ul>",
        //         TextHelps =
        //             "OPTIC has been engineered for standalone efficacy but its true potential shines when leveraged across an entire organization. A key outcome is to increase operational resilience, deny adversaries the ability to create unplanned outages, and prevent unsafe working conditions.",
        //         TextSummary =
        //             "OPTIC enhances OT cybersecurity by sharing intelligence on adversarial tactics, leveraging tools for situational awareness, maturity improvement, micro-baselining, and iterative investigation.",
        //         TextWorks =
        //             "The Department of Energy’s Cybersecurity, Energy Security, and Emergency Response Office (CESER) has partnered with Idaho National Laboratory (INL) and energy companies to develop OPTIC. This research initiative addresses cybersecurity threats against operational technology (OT) networks by sharing intelligence about adversarial tactics and techniques with the energy sector. OPTIC improves the sector’s ability to detect anomalous behavior that indicates potential malicious cyber activity in OT networks."
        //     });
        //     applications.Add(new Application
        //     {
        //         ApplicationName = "Scout",
        //         ApplicationUrl = "http://csetac.inl.gov:5100/home/login",
        //         ApplicationSourceUrl = "https://github.inl.gov/CyOTE/OPTIC",
        //         Tlr = 1,
        //         ApplicationIcon = "OPTICLogoEye.svg",
        //         TextData =
        //             "Scout will contribute to the existing knowledge archive stored in a data warehouse using JSON while publishing human readable reports.",
        //         TextHelps = "OPTICLogoEye.svg",
        //         TextSummary =
        //             "Scout accelerates cybersecurity reporting by using AI/ML to collect, summarize, and correlate events from open-source and public data.",
        //         TextWorks =
        //             "Scout is a tool designed to expedite a cybersecurity analysts reporting timeline by using standardized workflow and advanced AI/ML to collect, summarize, correlate and report on Cybersecurity events using Open source and public information."
        //     });

        //     context.Applications.AddRange(applications);
        // }

        // context.SaveChanges();

        // if (!context.ApplicationImages.Where(x => x.Application.ApplicationName.ToUpper() == "SCOUT").Any())
        // {
        //     var app = context.Applications.FirstOrDefault(x => x.ApplicationName.ToUpper() == "SCOUT");
        //     if (app != null)
        //     {
        //         var images = new List<ApplicationImage>();
        //         images.Add(new ApplicationImage
        //         {
        //             ApplicationId = app.ApplicationId,
        //             ImagePath = "Scout1.png"

        //         });
        //         images.Add(new ApplicationImage
        //         {
        //             ApplicationId = app.ApplicationId,
        //             ImagePath = "Scout2.png"

        //         });
        //         images.Add(new ApplicationImage
        //         {
        //             ApplicationId = app.ApplicationId,
        //             ImagePath = "Scout3.png"

        //         });
        //         context.ApplicationImages.AddRange(images);
        //     }

        //     if (!context.ApplicationImages.Where(x => x.Application.ApplicationName.ToUpper() == "INSIGHTS").Any())
        //     {
        //         var app1 = context.Applications.FirstOrDefault(x => x.ApplicationName.ToUpper() == "INSIGHTS");
        //         if (app1 != null)
        //         {
        //             var images = new List<ApplicationImage>();
        //             images.Add(new ApplicationImage
        //             {
        //                 ApplicationId = app1.ApplicationId,
        //                 ImagePath = "Insights1.png"

        //             });
        //             images.Add(new ApplicationImage
        //             {
        //                 ApplicationId = app1.ApplicationId,
        //                 ImagePath = "Insights2.png"

        //             });
        //             images.Add(new ApplicationImage
        //             {
        //                 ApplicationId = app1.ApplicationId,
        //                 ImagePath = "Insights3.png"

        //             });
        //             context.ApplicationImages.AddRange(images);
        //         }
        //     }
        // }

        // context.SaveChanges();
    }
}