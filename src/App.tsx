import React, { useState } from "react";
import "./style.css";

interface Workout {
  id: string;
  date: string; 
  km: number;
}

const App = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: "1", date: "20.07.19", km: 5.7 },
    { id: "2", date: "19.07.19", km: 14.2 },
    { id: "3", date: "18.07.19", km: 3.4 },
  ]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const dateInput = form.elements.namedItem("date") as HTMLInputElement;
    const kmInput = form.elements.namedItem("km") as HTMLInputElement;

    const date = dateInput.value.trim();
    const km = parseFloat(kmInput.value);

    if (!/^\d{2}\.\d{2}\.\d{2}$/.test(date) || isNaN(km) || km <= 0) {
      alert("Неверный формат даты или расстояния");
      return;
    }

    const existingIndex = workouts.findIndex((w) => w.date === date);
    if (existingIndex >= 0) {
      const updated = [...workouts];
      updated[existingIndex] = {
        ...updated[existingIndex],
        km: updated[existingIndex].km + km,
      };
      setWorkouts(updated);
    } else {
      setWorkouts((prev) => [{ id: Date.now().toString(), date, km }, ...prev]);
    }

    dateInput.value = "";
    kmInput.value = "";
  };

  const handleDelete = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const sorted = [...workouts].sort((a, b) => {
    const [d1, m1, y1] = a.date.split(".").map(Number);
    const [d2, m2, y2] = b.date.split(".").map(Number);
    const date1 = new Date(2000 + y1, m1 - 1, d1);
    const date2 = new Date(2000 + y2, m2 - 1, d2);
    return date2.getTime() - date1.getTime(); // DESC
  });

  return (
    <div className="container">
      <form onSubmit={handleAdd} className="form-row">
        <div className="form-group">
          <label>Дата (ДД.ММ.ГГ)</label>
          <input name="date" type="text" placeholder="20.07.19" />
        </div>
        <div className="form-group">
          <label>Пройдено км</label>
          <input name="km" type="number" step="0.1" min="0" placeholder="5.7" />
        </div>
        <div className="form-group">
          <label>&nbsp;</label>
          <button type="submit" className="submit-btn">
            OK
          </button>
        </div>
      </form>

      <div className="data-table">
        <div className="table-header">
          <div className="col-date">Дата (ДД.ММ.ГГ)</div>
          <div className="col-distance">Пройдено км</div>
          <div className="col-actions">Действия</div>
        </div>
        <div className="table-body">
          {sorted.length === 0 ? (
            <div className="empty-state">Нет записей</div>
          ) : (
            sorted.map((item) => (
              <div key={item.id} className="table-row">
                <div className="col-date">{item.date}</div>
                <div className="col-distance">{item.km.toFixed(1)}</div>
                <div className="col-actions">
                  <button
                    className="action-btn edit-btn"
                    title="Редактировать"
                    onClick={() => {
                      const dateInput = document.querySelector(
                        'input[name="date"]'
                      ) as HTMLInputElement;
                      const kmInput = document.querySelector(
                        'input[name="km"]'
                      ) as HTMLInputElement;
                      if (dateInput && kmInput) {
                        dateInput.value = item.date;
                        kmInput.value = item.km.toString();
                        handleDelete(item.id);
                      }
                    }}
                  >
                    ✎
                  </button>
                  <button
                    className="action-btn delete-btn"
                    title="Удалить"
                    onClick={() => handleDelete(item.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
