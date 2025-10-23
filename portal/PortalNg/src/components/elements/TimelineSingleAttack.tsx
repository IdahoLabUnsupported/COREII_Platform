// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// React
import * as React from 'react';

// Define the Technique interface
interface Technique {
  CaseStudyId: number;
  D_Notation: string;
  CaseStudyObservableTimingId?: number;
  CaseStudyTechniqueId?: number;
  MITRE_TacticId?: number;
  MITRE_TechniqueId?: number;
  Tactic_Name?: string;
  Technique_Name?: string;
  Technique_Narratives?: string;
  TimingOrder?: number;
  UTC_Time?: string;
}

type Props = {
  techniqueList: Technique[];
  handleSetActiveSlide: (index: number) => void;
  activeSlideIndex: number;
};

const TimelineSingleAttack: React.FC<Props> = ({
  techniqueList,
  handleSetActiveSlide,
  activeSlideIndex
}) => {
  const initialAccess = 0;

  const updatedTechniqueList = techniqueList.map((technique, index) => {
    if (index === 0 && technique.CaseStudyId === 24) {
      return {
        ...technique,
        D_Notation: "D-50"
      };
    }
    return technique;
  });
  
  
  // Find the index of the first item with D_Notation as "D-0"
  const triggeringEvent = updatedTechniqueList.findIndex(technique => technique.D_Notation === "D-0");
  
  // Fetch the D_Notation value of the first item in the updatedTechniqueList
  const firstItemTiming = updatedTechniqueList.length > 0 ? updatedTechniqueList[0].D_Notation : null;

  return (
    <>
      <ul className="steps flex flex-row overflow-scroll-x pt-1 pb-20">
        {updatedTechniqueList.map((_, index: number) => {
          return (
            <React.Fragment key={index}>
              <li className={`step relative cursor-pointer ${activeSlideIndex === index ? 'step-primary' : ''}`} onClick={() => handleSetActiveSlide(index)}>
                {activeSlideIndex === index &&
                  <span className="absolute top-[-2rem] text-lg font-semibold">Step {index+1}</span>
                }

                {initialAccess === index && triggeringEvent === index &&
                  <span className="absolute top-[3rem] text-sm">
                    {firstItemTiming} <br />
                    Initial Access & Trigger
                  </span>
                }

                {initialAccess === index && triggeringEvent !== index &&
                  <span className="absolute top-[3rem] text-sm">
                    {firstItemTiming} <br />
                    Initial Access
                  </span>
                }

                {updatedTechniqueList[index].CaseStudyId !== 24 && triggeringEvent === index && initialAccess !== index &&
                  <span className="absolute top-[3rem] text-sm">
                    D-0 <br />
                    Triggering Event
                  </span>
                }

                {index === 23 && updatedTechniqueList[index].CaseStudyId === 24 &&
                  <span className="absolute top-[3rem] text-sm">
                    D-0 <br />
                    Triggering Event
                  </span>
                }


                {/* {comprehension === index &&
                    <span className="absolute top-[3rem] text-sm">
                      H+12 <br />
                      Comprehension
                    </span>
                } */}
              </li>
            </React.Fragment>
          )
        })}
      </ul>
    </>
  );
}

export default TimelineSingleAttack;
