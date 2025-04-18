export async function fetchNeuronWriterData() {
  const response = await fetch('/api/nw-prompt-data');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
} 