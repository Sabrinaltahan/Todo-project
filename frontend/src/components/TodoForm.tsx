import { useState } from "react";
import type { Todo, TodoStatus } from "../types/todo";

type Props = {
  onCreate: (data: Omit<Todo, "id">) => Promise<void>;
};

export default function TodoForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TodoStatus>("not_started");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const t = title.trim();
    if (t.length < 3) return "Titeln måste vara minst 3 tecken.";
    if (description.length > 200) return "Beskrivning får max vara 200 tecken.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim() || "",
        status,
      });
      setTitle("");
      setDescription("");
      setStatus("not_started");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <h2 style={{ marginTop: 0 }}>Lägg till Todo</h2>

      <label>
        Titel *
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Minst 3 tecken"
          style={{ width: "100%", padding: 10, marginTop: 6, marginBottom: 10 }}
        />
      </label>

      <label>
        Beskrivning (max 200)
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: 10, marginTop: 6, marginBottom: 10 }}
        />
      </label>

      <label>
        Status
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TodoStatus)}
          style={{ width: "100%", padding: 10, marginTop: 6, marginBottom: 10 }}
        >
          <option value="not_started">Ej påbörjad</option>
          <option value="in_progress">Pågående</option>
          <option value="done">Avklarad</option>
        </select>
      </label>

      {error && <p style={{ color: "crimson", marginTop: 0 }}>{error}</p>}

      <button disabled={submitting} style={{ padding: "10px 14px" }}>
        {submitting ? "Skapar..." : "Skapa"}
      </button>
    </form>
  );
}