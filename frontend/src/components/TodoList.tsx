import type { Todo, TodoStatus } from "../types/todo";

type Props = {
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
  onChangeStatus: (id: number, status: TodoStatus) => Promise<void>;
};

function statusLabel(s: TodoStatus) {
  if (s === "not_started") return "Ej påbörjad";
  if (s === "in_progress") return "Pågående";
  return "Avklarad";
}

export default function TodoList({ todos, onDelete, onChangeStatus }: Props) {
  if (todos.length === 0) return <p>Inga todos än.</p>;

  return (
    <div style={{ marginTop: 16 }}>
      <h2>Todos</h2>

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
        {todos.map((t) => (
          <li key={t.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div style={{ minWidth: 220 }}>
                <strong>{t.title}</strong>
                {t.description ? <p style={{ margin: "6px 0" }}>{t.description}</p> : null}
                <small>Status: {statusLabel(t.status)}</small>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <select
                  value={t.status}
                  onChange={(e) => onChangeStatus(t.id, e.target.value as TodoStatus)}
                  style={{ padding: 8 }}
                >
                  <option value="not_started">Ej påbörjad</option>
                  <option value="in_progress">Pågående</option>
                  <option value="done">Avklarad</option>
                </select>

                <button onClick={() => onDelete(t.id)} style={{ padding: "8px 10px" }}>
                  Ta bort
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}