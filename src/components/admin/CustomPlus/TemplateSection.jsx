import React from "react";

const TemplateSection = ({ activeMenu }) => {
    return (

        <>


            {activeMenu === "text" && (
                <div className="cp-panel-grid">

                    <button className="cp-panel-btn">
                        Add Heading
                    </button>

                    <button className="cp-panel-btn">
                        Add Sub Heading
                    </button>

                    <button className="cp-panel-btn">
                        Add Paragraph
                    </button>

                </div>
            )}

            {activeMenu === "upload" && (

                <div className="cp-upload-box">

                    <button className="cp-upload-btn">

                        Upload Image

                    </button>

                </div>

            )}
            {/* 
      {activeMenu === "design" && (

        <div className="cp-template-grid">

          <div className="cp-template-card">
            Design 1
          </div>

          <div className="cp-template-card">
            Design 2
          </div>

          <div className="cp-template-card">
            Design 3
          </div>

          <div className="cp-template-card">
            Design 4
          </div>

        </div>

      )} */}

            {activeMenu === "sticker" && (

                <div className="cp-sticker-grid">

                    😀 😎 🎉 ❤️ ⭐ 🚀 🎈 🎂 🎁

                </div>

            )}

            {activeMenu === "preview" && (

                <button className="cp-preview-btn">

                    Preview Design

                </button>

            )}

        </>
    );
};

export default TemplateSection;