import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useServices } from "../../context/ServiceContext";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { ServiceForm } from "./ServiceForm";
import { toast } from "react-toastify";

export function ServiceManagerList() {
  const { services, addService, updateService, deleteService } = useServices();
  const [editingService, setEditingService] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  function openNewForm() {
    setEditingService(null);
    setIsFormOpen(true);
  }

  function openEditForm(service) {
    setEditingService(service);
    setIsFormOpen(true);
  }

  function handleSubmit(values) {
    if (editingService) {
      updateService(editingService.id, values);
      toast.success("Hizmet güncellendi");
    } else {
      addService(values);
      toast.success("Hizmet eklendi");
    }
    setIsFormOpen(false);
  }

  function handleDelete(service) {
    if (window.confirm(`"${service.name}" hizmetini silmek istediğinize emin misiniz?`)) {
      deleteService(service.id);
      toast.info("Hizmet silindi");
    }
  }

  return (
    <div className="service-manager">
      <div className="service-manager__header">
        <h3>Hizmetler</h3>
        <Button size="sm" onClick={openNewForm}>
          <Plus size={16} /> Yeni hizmet
        </Button>
      </div>
      <ul className="service-manager__list">
        {services.map((service) => (
          <li key={service.id} className="service-manager__item">
            <div>
              <strong>{service.name}</strong>
              <span className="service-manager__item-meta">
                {service.durationMinutes} dk · {service.price} ₺
              </span>
            </div>
            <div className="service-manager__item-actions">
              <button type="button" onClick={() => openEditForm(service)} aria-label="Düzenle">
                <Pencil size={16} />
              </button>
              <button type="button" onClick={() => handleDelete(service)} aria-label="Sil">
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
        {services.length === 0 && <p className="service-manager__empty">Henüz hizmet eklenmedi.</p>}
      </ul>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingService ? "Hizmeti düzenle" : "Yeni hizmet ekle"}
      >
        <ServiceForm
          initialValues={editingService}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
