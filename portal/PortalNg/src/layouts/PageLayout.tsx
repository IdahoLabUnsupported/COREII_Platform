// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { MutableRefObject } from "react";
import ButtonBasic from "../components/elements/ButtonBasic"; // Assuming ButtonBasic is correctly imported
import ModalTriggerButton from '../components/elements/ModalTriggerButton';
import { useKeenSlider, KeenSliderPlugin, KeenSliderInstance} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ButtonBasic1 from "../components/elements/ButtonBasic1";

interface LayoutProps {
    title: string;
    buttons: {
        first: { text: string; link: string };
        second: { text: string; link: string };
    };
    sections: {
        intro: string;
        dataOrigin: string;
        utility: string;
        images: []; 
        thumbs: [];
    };
    modalInfo: {
        buttonLabel: string;
        modalTitle: string;
        imageSrc: string;
        buttonStyle: React.CSSProperties;
    };
}




const GeneralLayout: React.FC<LayoutProps> = ({ title, buttons, sections, modalInfo }) => {
    function ThumbnailPlugin(
        mainRef: MutableRefObject<KeenSliderInstance | null>
      ): KeenSliderPlugin {
        return (slider) => {
          function removeActive() {
            slider.slides.forEach((slide) => {
              slide.classList.remove("active")
            })
          }
          function addActive(idx: number) {
            slider.slides[idx].classList.add("active")
          }
      
          function addClickEvents() {
            slider.slides.forEach((slide, idx) => {
              slide.addEventListener("click", () => {
                if (mainRef.current) mainRef.current.moveToIdx(idx)
              })
            })
          }
      
          slider.on("created", () => {
            if (!mainRef.current) return
            addActive(slider.track.details.rel)
            addClickEvents()
            mainRef.current.on("animationStarted", (main) => {
              removeActive()
              const next = main.animator.targetIdx || 0
              addActive(main.track.absToRel(next))
              slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
            })
          })
        }
      }
      const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        initial: 0,
      })
      const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
        {
          initial: 0,
          slides: {
            perView: 4,
            spacing: 10,
          },
        },
        [ThumbnailPlugin(instanceRef)]
      )
      
    return (
        <div className="w-full h-screen dark:bg-gray-700 dark:text-white bg-gray-200 text-black flex flex-col pb-4">
            <div className="grid grid-cols-2 gap-2 p-5 dark:bg-gray-800 bg-white" style={{ height: '6.25%', paddingBottom:'65px' }}>
                <div className="col-span-1 flex items-center justify-left">
                    <h2 className="ms-6 text-4xl text-gray-800 dark:text-white">{title}</h2>
                    <ModalTriggerButton
                        buttonLabel={modalInfo.buttonLabel}
                        modalTitle={modalInfo.modalTitle}
                        mini={true}
                        imageSrc={modalInfo.imageSrc}
                        buttonStyle={modalInfo.buttonStyle}
                        classNames="mt-6"
                    />

                </div>
                <div className="grid grid-cols-1 col-span-1 gap-2 ">
                    <div className="flex items-center justify-end  text-right gap-2">
                        <ButtonBasic1 label={buttons.first.text} color="btn-primary" link={buttons.first.link}/>
                        <ButtonBasic1 label={buttons.second.text} color="btn-secondary" link={buttons.second.link}/>
                    </div>

                </div>
            </div>
            <div className="dark:bg-gray-700 bg-gray-200 grid flex-grow-50 pt-5">
            {sections.intro && sections.intro.length ?(
            <div className="grid grid-cols-3 mt-4 flex-grow-50" >
               {/*}
                <div className="col-span-1 flex items-center justify-center h-full">
                    <div className="w-4/6 h-4/6 flex items-center justify-center text-xl font-bold text-gray-800">
                    {sections.introImage.length ?(
                        <img src={String(sections.introImage)} alt="intro"/>
                    ):null}
                    </div>
                   
                </div>
                */}
                <div className="col-span-2 flex flex-col px-11">
                    <h2 className="text-2xl mb-2">How it works</h2>
                    <div dangerouslySetInnerHTML={{__html: sections.intro}}></div>
                </div>
            </div>
            ):null
            }
            {sections.dataOrigin && sections.dataOrigin.length ?(
                <div className="grid grid-cols-3 mt-4 flex-grow-50" >
                    <div className="col-span-2 flex flex-col px-11">
                        <h2 className="text-2xl mb-2">Where the data comes from</h2>
                        <div dangerouslySetInnerHTML={{__html: sections.dataOrigin}}></div>
                    </div>
                    {/*
                    <div className="col-span-1 flex items-center justify-center h-full">
                        <div className="w-4/6 h-4/6 flex items-center justify-center text-xl font-bold text-gray-800">
                            {sections.dataOriginImage.length ?(
                            <img src={String(sections.dataOriginImage)} alt="intro" />
                            ):null}
                        </div>
                    </div>
                    */}
                </div>

            ):null
            }

            {sections.utility && sections.utility.length ? (
                <div className="grid grid-cols-3 mt-4 flex-grow-50 pb-6" >
                    {/*
                    <div className="col-span-1 flex items-center justify-center h-full">
                        <div className="w-4/6 h-4/6 flex items-center justify-center text-xl font-bold text-gray-800">
                        {sections.utilityImage.length ?(
                            <img src={String(sections.utilityImage)} alt="intro" />
                        ):null}
                        </div>
                    </div>
                    */}
                    <div className="col-span-2 flex flex-col px-11">
                        <h2 className="text-2xl mb-2">How it helps your organization</h2>
                        <div dangerouslySetInnerHTML={{__html: sections.utility}}></div>
                    </div>
                </div>
            ):null}
            </div>
            {sections.images && sections.images.length ? (
              <div className="grid mt-4 flex-grow-50 dark:bg-gray-800 pb-6">
                 
                  <div ref={sliderRef} className="keen-slider slider-height ">
                     {sections.images}
                  </div>
                  <div ref={thumbnailRef} className="keen-slider thumbnail dark:bg-gray-700">
                      {sections.thumbs}
                  </div>
              
              </div>
            ):null}
        </div>
    );
};

export default GeneralLayout;
