// Генерирует уникальный ID для новых сотрудников и проектов
// Например: generateId('emp') → "emp-1748392847123"
export function generateId(prefix) {
    return prefix + "-" + Date.now();
}
