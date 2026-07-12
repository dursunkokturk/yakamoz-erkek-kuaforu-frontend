import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function ServiceForm({ initialValues, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues ?? { name: "", durationMinutes: 30, price: 0 },
  });

  useEffect(() => {
    reset(initialValues ?? { name: "", durationMinutes: 30, price: 0 });
  }, [initialValues, reset]);

  function submitHandler(values) {
    onSubmit({
      name: values.name.trim(),
      durationMinutes: Number(values.durationMinutes),
      price: Number(values.price),
    });
  }

  return (
    <form className="service-form" onSubmit={handleSubmit(submitHandler)}>
      <Input
        label="Hizmet adı"
        placeholder="Örn. Saç Kesimi"
        error={errors.name?.message}
        {...register("name", { required: "Hizmet adı zorunludur" })}
      />
      <Input
        label="Süre (dakika)"
        type="number"
        min={5}
        step={5}
        error={errors.durationMinutes?.message}
        {...register("durationMinutes", {
          required: "Süre zorunludur",
          min: { value: 5, message: "En az 5 dakika olmalı" },
        })}
      />
      <Input
        label="Ücret (₺)"
        type="number"
        min={0}
        step={10}
        error={errors.price?.message}
        {...register("price", {
          required: "Ücret zorunludur",
          min: { value: 0, message: "Ücret negatif olamaz" },
        })}
      />
      <div className="service-form__actions">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Vazgeç
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Kaydet
        </Button>
      </div>
    </form>
  );
}
