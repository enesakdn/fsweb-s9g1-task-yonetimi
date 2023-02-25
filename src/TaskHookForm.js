import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

const TaskHookForm = ({ kisiler, submitFn }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    people: [],
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);

  // form datası her güncellendiğinde valid mi diye kontrol et
  useEffect(() => {
    setButtonDisabled(Object.keys(errors).length == !0);
  }, [errors]);

  // checkboxların değişimini state içerisine eklemek için özel fonksiyon
  function handleCheckboxChange(e) {
    const { value } = e.target;

    let yeniPeople = [...formData.people];
    const index = formData.people.indexOf(value);
    if (index >= 0) {
      yeniPeople.splice(index, 1);
    } else {
      yeniPeople.push(value);
    }

    setFormData({
      ...formData,
      people: yeniPeople,
    });
  }

  function onSubmit(data, e) {
    e.preventDefault();
    const newTask = {
      ...data,
      id: nanoid(5),
      status: "yapılacak",
    };
    submitFn((prevTasks) => [...prevTasks, newTask]);
    setFormData({ title: "", description: "", people: [] });
  }

  const notify = () => toast("Yeni Göre Eklendi ! Hadi Başlayalım!");

  return (
    <form className="TaskHookForm" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-line">
        <label className="input-label" htmlFor="title">
          Başlık
        </label>
        <input
          className="input-text"
          id="title"
          name="title"
          type="text"
          {...register("title", {
            required: "Task başlığı yazmalısınız",
            minLength: {
              value: 3,
              message: "Task başlığı en az 3 karakter olmalı",
            },
          })}
        />
        <p className="input-error">{errors.title?.message} </p>
      </div>

      <div className="form-line">
        <label className="input-label" htmlFor="description">
          Açıklama
        </label>
        <textarea
          className="input-textarea"
          rows="3"
          id="description"
          name="description"
          {...register("description", {
            required: "Task açıklaması yazmalısınız",
            minLength: {
              value: 10,
              message: "Task açıklaması en az 10 karakter olmalı",
            },
          })}
        ></textarea>
        <p className="input-error">{errors.description?.message}</p>
      </div>

      <div className="form-line">
        <label className="input-label">İnsanlar</label>
        <div>
          {kisiler.map((p) => (
            <label className="input-checkbox" key={p}>
              <input
                type="checkbox"
                name="people"
                value={p}
                onChange={handleCheckboxChange}
                {...register("people")}
              />
              {p}
            </label>
          ))}
        </div>
      </div>

      <div className="form-line">
        <button
          className="submit-button"
          type="submit"
          disabled={buttonDisabled}
          onClick={notify}
        >
          Kaydet
        </button>
        <ToastContainer />
      </div>
    </form>
  );
};

export default TaskHookForm;
