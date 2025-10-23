// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// React
import * as React from 'react';

//Custom Components
import ButtonBasic from '../elements/ButtonBasic';

type Props = object;

const Hero: React.FC<Props> = () => {
  return (
    <>
      <div className="wrapper p-0 m-0">
        <div className="hero min-h-54 bg-base-200 w-full">
          <div className="hero-content  grid-cols-2 gap-2 p-0 m-0">
              <div className="align-left text-left">
                  <img className="" src={import.meta.env.BASE_URL + "/CyOTE_logo_23-0807_nostars.svg"} width="600"
                       alt="CyOTE logo" />
              </div>
              <div className="py-6 pl-2 pr-4">
                  <div>
                      <h2 className="text-4xl mb-8 text-gray-800 dark:text-white">
                          COREII Getting Started
                      </h2>
                  </div>
                  <div>
                      <p className="py-6">The Cybersecurity Operations Research, Experimentation, Integration, and
                          Innovation (COREII) is a platform tool focused on enabling advanced applied research and
                          development. In the final form it will have artificial intelligence, machine learning, large
                          language models, Bayesian networks, OT Cybersecurity intelligence, and ton of other industry
                          recognized capabilities to empower the research user.</p>

                      <div className="space-x-2">
                          <ButtonBasic
                              link={{
                                  title: 'LEARN MORE ABOUT COREII',
                                  location: '/dashboard'
                              }}
                              color={'btn-primary'}
                          />

                      </div>
                  </div>


              </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
