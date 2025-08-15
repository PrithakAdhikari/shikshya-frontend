import { useState, useMemo, useEffect, useRef } from "react";
import Editor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import ReactMarkdownComponent from "../Components/ReactMarkdownComponent";
import { FaPlus, FaBars, FaTrash, FaGlobe, FaLock, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../Contexts/useTheme";
import MarkdownIt from "markdown-it";
import { useAuth } from "../Contexts/useAuth";
import toast from "react-hot-toast";

const mdParser = new MarkdownIt();
const API_URL = import.meta.env.VITE_API_URL;

const visibilityOptions = [
  { label: "Public", icon: <FaGlobe className="inline mr-2" /> },
  { label: "Private", icon: <FaLock className="inline mr-2" /> },
  { label: "Unlisted", icon: <FaEyeSlash className="inline mr-2" /> },
];

// Generate unique internal IDs for React keys only
const generateId = () => Date.now() + Math.random();

const CreateCourse = () => {
  const { isDark } = useTheme();
  const { user, authAxios } = useAuth();
  const [loading, setLoading] = useState(false);

  const getIconForVisibility = (visibility) => {
    const found = visibilityOptions.find((opt) => opt.label === visibility);
    return found ? found.icon : null;
  };

  const userId = user?.id;

  const [course, setCourse] = useState({
    title: "",
    desc: "",
    instructor_user_fk_id: userId,
    visibility: "Public",
    curriculum: [
      { id: generateId(), title: "Section 1", md_text: "" },
      { id: generateId(), title: "Section 2", md_text: "" },
    ],
  });

  const [thumbnailFile, setThumbnailFile] = useState(null); // File upload
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentSection = useMemo(
    () => course.curriculum[activeIndex] || {},
    [course.curriculum, activeIndex]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleUpdateSection = (field, value) => {
    setCourse((prev) => {
      const updated = [...prev.curriculum];
      updated[activeIndex] = { ...updated[activeIndex], [field]: value };
      return { ...prev, curriculum: updated };
    });
  };

  const handleAddSection = () => {
    setCourse((prev) => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        { id: generateId(), title: `Section ${prev.curriculum.length + 1}`, md_text: "" },
      ],
    }));
    setActiveIndex(course.curriculum.length);
  };

  const handleDeleteSection = (index) => {
    toast((t) => (
      <span>
        Are you sure?
        <button
          onClick={() => {
            setCourse((prev) => {
              const newCurriculum = prev.curriculum.filter((_, idx) => idx !== index);
              return { ...prev, curriculum: newCurriculum };
            });
            setActiveIndex((cur) => {
              if (cur === index) return 0;
              else if (cur > index) return cur - 1;
              else return cur;
            });
            toast.dismiss(t.id);
          }}
          className="ml-3 px-3 py-1 bg-red-500 text-white rounded"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-2 px-3 py-1 bg-gray-300 rounded"
        >
          No
        </button>
      </span>
    ), { duration: 5000 });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("desc", course.desc);
      formData.append("visibility", course.visibility);
      formData.append("instructor_user_fk_id", userId);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      formData.append(
        "curriculum",
        JSON.stringify(course.curriculum.map(({ id, ...rest }) => rest))
      );

      const response = await authAxios.post(`${API_URL}api/courses`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Course successfully created!");
      console.log("Course saved:", response.data);
    } catch (error) {
      let errorMessage = "Failed to create course.";

      if (error.response) {
        if (typeof error.response.data === "string") {
          errorMessage += " " + error.response.data;
        } else if (error.response.data.message) {
          errorMessage += " " + error.response.data.message;
        } else {
          errorMessage += " " + JSON.stringify(error.response.data);
        }
      }

      toast.error(errorMessage);
      console.error("Failed to save course:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.fonts?.ready.then(() => {
      window.dispatchEvent(new Event("resize"));
    });
  }, []);

  const editorStyles = `
  .rc-md-editor {
    background: ${isDark ? "#1d232a" : "#ffffff"} !important;
    color: ${isDark ? "#d1d5db" : "#111827"} !important;
    font-family: Menlo, Monaco, Consolas, monospace;
  }
  .rc-md-editor .rc-md-navigation {
    background: ${isDark ? "#111827" : "#f3f4f6"} !important;
  }
  .rc-md-editor .rc-md-toolbar {
    background: ${isDark ? "#111827" : "#f3f4f6"} !important;
    border-bottom: 1px solid ${isDark ? "#374151" : "#e5e7eb"} !important;
  }
  .rc-md-editor .rc-md-text {
    background: ${isDark ? "#1d232a" : "#ffffff"} !important;
    color: ${isDark ? "#d1d5db" : "#111827"} !important;
    caret-color: ${isDark ? "#f87171" : "#ef4444"} !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
  }
  .rc-md-editor textarea {
    background: transparent !important;
    color: inherit !important;
  }
  .rc-md-editor .rc-md-text:focus {
    outline: none !important;
    box-shadow: 0 0 0 2px ${isDark ? "#f87171" : "#ef4444"} !important;
  }
`;

  return (
    <div className="h-[90vh] w-full bg-base-200 p-4 overflow-hidden">
      {/* ====== MOBILE: Hamburger ====== */}
      <div className="md:hidden mb-4 left-4 top-4" ref={dropdownRef}>
        <div className="relative">
          <button
            className="btn btn-circle btn-secondary shadow-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </button>

          {menuOpen && (
            <div className="absolute mt-2 w-64 bg-base-100 rounded-lg shadow z-50 p-4 space-y-4">
              {/* Mobile Course Settings */}
              <div className="p-3 rounded-lg border border-base-300 space-y-3">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Course Title"
                  value={course.title}
                  onChange={(e) => setCourse((prev) => ({ ...prev, title: e.target.value }))}
                />

                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Course Description"
                  rows={3}
                  value={course.desc}
                  onChange={(e) => setCourse((prev) => ({ ...prev, desc: e.target.value }))}
                />

                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                />
                {thumbnailFile && (
                  <img
                    src={URL.createObjectURL(thumbnailFile)}
                    alt="Thumbnail Preview"
                    className="mt-2 w-full h-40 object-cover rounded"
                  />
                )}

                {/* Mobile Visibility Selector */}
                <div>
                  <label className="block text-sm font-light mb-1 text-base-content/60">Visibility</label>
                  <div className="dropdown w-full">
                    <label tabIndex={0} className="btn btn-outline w-full flex justify-between">
                      <span className="flex items-center">
                        {getIconForVisibility(course.visibility)} {course.visibility}
                      </span>
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44">
                      {visibilityOptions.map((opt) => (
                        <li key={opt.label}>
                          <button
                            onClick={() => setCourse((prev) => ({ ...prev, visibility: opt.label }))}
                            className={course.visibility === opt.label ? "bg-primary text-white" : ""}
                          >
                            {opt.icon}
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mobile Curriculum */}
              <h2 className="text-lg font-bold">Curriculum</h2>
              {course.curriculum.map((section, idx) => (
                <div
                  key={section.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 cursor-pointer px-2 py-1 rounded-lg transition-all ${
                    idx === activeIndex ? "bg-secondary/30 font-semibold" : "hover:bg-base-200"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full border-2 ${
                      idx === activeIndex ? "bg-primary border-primary" : "border-primary"
                    }`}
                  ></span>
                  <span className="text-sm">{section.title}</span>
                </div>
              ))}
              <div className="flex flex-col items-center space-y-4 pt-4">
                <button
                  onClick={() => {
                    handleAddSection();
                    setMenuOpen(false);
                  }}
                  className="btn btn-primary btn-circle w-12 h-12 flex items-center justify-center text-white text-xl hover:bg-primary-focus transition"
                >
                  <FaPlus />
                </button>
                {!loading ? (
                <button onClick={handleSubmit} className="btn btn-primary w-full max-w-xs">
                  Submit
                </button>
                ): (
                  <button onClick={handleSubmit} className="btn btn-primary w-full max-w-xs" disabled>
                  <span className="loading loading-dots loading-sm"></span>
                </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====== LAYOUT ====== */}
      <div className="flex h-[calc(100%-6rem)] gap-4">
        {/* ====== DESKTOP: Sidebar ====== */}
        <div className="hidden md:flex flex-col w-1/4 bg-base-100 rounded-lg shadow p-4 overflow-y-auto">
          {/* Course Settings Card */}
          <div className="mb-4 p-3 rounded-lg border border-base-300 space-y-3">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Course Title"
              value={course.title}
              onChange={(e) => setCourse((prev) => ({ ...prev, title: e.target.value }))}
            />

            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Course Description"
              rows={3}
              value={course.desc}
              onChange={(e) => setCourse((prev) => ({ ...prev, desc: e.target.value }))}
            />

            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
            />
            {thumbnailFile && (
              <img
                src={URL.createObjectURL(thumbnailFile)}
                alt="Thumbnail Preview"
                className="mt-2 w-full h-40 object-cover rounded"
              />
            )}

            {/* Desktop Visibility Selector */}
            <div>
              <label className="block text-sm font-light text-base-content/60 mb-1">Visibility</label>
              <div className="dropdown dropdown-end w-full">
                <label tabIndex={0} className="btn btn-outline w-full flex justify-between items-center">
                  <span className="flex items-center">
                    {getIconForVisibility(course.visibility)} {course.visibility}
                  </span>
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44">
                  {visibilityOptions.map((opt) => (
                    <li key={opt.label}>
                      <button
                        onClick={() => setCourse((prev) => ({ ...prev, visibility: opt.label }))}
                        className={course.visibility === opt.label ? "bg-primary text-white" : ""}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Curriculum List */}
          <h2 className="text-lg font-bold mb-2">Curriculum</h2>
          <div className="flex-grow overflow-y-auto space-y-2 mb-4">
            {course.curriculum.map((section, idx) => (
              <button
                key={section.id}
                onClick={() => setActiveIndex(idx)}
                className={`btn btn-sm text-left justify-start w-full ${
                  idx === activeIndex ? "btn-primary" : "btn-ghost"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-4 flex-shrink-0">
            <button
              onClick={handleAddSection}
              className="btn btn-primary btn-circle w-8 h-8 flex items-center justify-center text-white text-[1rem]"
              title="Add Section"
            >
              <FaPlus />
            </button>
            {!loading ? (
                <button onClick={handleSubmit} className="btn btn-primary w-full max-w-xs">
                  Submit
                </button>
                ): (
                  <button onClick={handleSubmit} className="btn btn-primary w-full max-w-xs" disabled>
                  <span className="loading loading-dots loading-sm"></span>
                </button>
                )}
          </div>
        </div>

        {/* ====== MAIN CONTENT ====== */}
        <div className="flex-1 bg-base-100 rounded-lg shadow p-4 overflow-y-auto space-y-4">
          {/* Section Editor */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Section Title"
              value={currentSection.title || ""}
              onChange={(e) => handleUpdateSection("title", e.target.value)}
            />
            <button
              className="btn btn-ghost text-red-500 hover:text-red-700"
              onClick={() => handleDeleteSection(activeIndex)}
              disabled={course.curriculum.length === 1}
            >
              <FaTrash />
            </button>
          </div>

          <style>{editorStyles}</style>
          <Editor
            value={currentSection.md_text || ""}
            style={{ height: "300px", flexShrink: 0 }}
            config={{
              view: {
                menu: true,
                md: true,
                html: false,
              },
            }}
            onChange={({ text }) => handleUpdateSection("md_text", text)}
            renderHTML={(text) => mdParser.render(text)}
          />

          <h3 className="mt-6 mb-2 text-lg font-bold">Preview</h3>
          <div className="prose bg-base-100 p-4 rounded-lg shadow overflow-y-auto flex-1">
            <ReactMarkdownComponent md_text={currentSection.md_text} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
