import React from "react";
import "./ContactList.css";
import AgendaItemMemo from "../AgendaItem/AgendaItem";
import { useDebounce } from 'use-debounce';

const ContactList = React.memo(() => {
  const API_URL = "http://localhost:4000/agenda";

  const [contactList, setContactList] = React.useState([]);
  const [newContact, setNewContact] = React.useState({ name: "", surname: "", phone: "" });
  const [total, setTotal] = React.useState(0);
  const [wordData, setWordData] = React.useState("");
  const [wordDataDelay] = useDebounce(wordData, 1000);

  React.useEffect(() => {
    if (wordData.trim().length === 0) {
      getAllContactsFromApi();
    } else {
      fetch(`${API_URL}?q=${wordData}`)
        .then(response => response.json())
        .then(data => {
          setContactList(data);
          setTotal(data.length);
        });
    }
  }, [wordDataDelay]);

  const getAllContactsFromApi = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setContactList(data);
        setTotal(data.length);
      });
  }

  const deleteContact = React.useCallback((agenda) => {
    fetch(`${API_URL}/${agenda.id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(() => getAllContactsFromApi());
  }, []);

  const addNewContact = (event) => {
    event.preventDefault();

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newContact),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(() => {
        getAllContactsFromApi();
        // Limpiamos el formulario
        setNewContact({
          name: "",
          surname: "",
          phone: "",
          imageUrl: "",
        });
      });
  }

  return (
    <div className="contact-list">
      
      {/* formulario para añadir nuevo contacto*/}
      <h2>Añadir nuevo contacto</h2>
      <form onSubmit={(event) => addNewContact(event)}>
        <p>
          <label>Nombre:</label>
          <input type="text" name="name" id="name" value={newContact.name} onChange={(event) => setNewContact({
            ...newContact,
            name: event.target.value,
          })} />
        </p>
        <p>
          <label>Apellido:</label>
          <input type="text" name="surname" id="surname" value={newContact.surname} onChange={(event) => setNewContact({
            ...newContact,
            surname: event.target.value,
          })} />
        </p>
        <p>
          <label>Teléfono:</label>
          <input type="number" name="phone" id="phone" value={newContact.phone} onChange={(event) => setNewContact({
            ...newContact,
            phone: event.target.value ? parseInt(event.target.value) : '',
          })} />
        </p>
        <p>
          <label>URL de la imagen:</label>
          <input type="url" name="imageUrl" id="imageUrl" value={newContact.imageUrl} onChange={(event) => setNewContact({
            ...newContact,
            imageUrl: event.target.value,
          })} />
        </p>

        <button type="submit">Añadir contacto</button>

      </form>
      
      <h2>Buscar</h2>
      <p>
        <label>Buscar:</label>
        <input type="text" value={wordData} onChange={(event) => setWordData(event.target.value)} />
      </p>

      <h2>Mi agenda ({total})</h2>

      {/* listado de contactos */}
      {contactList.map(agenda =>
        <AgendaItemMemo
          key={agenda.id}
          agenda={agenda}
          deleteItem={deleteContact}
        ></AgendaItemMemo>)}

    </div>
  );
});

export default ContactList;
