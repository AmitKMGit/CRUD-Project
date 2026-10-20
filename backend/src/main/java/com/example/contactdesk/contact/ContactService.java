package com.example.contactdesk.contact;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class ContactService {

    private final ContactRepository repository;

    public ContactService(ContactRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Contact> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.ASC, "name"));
    }

    public Contact create(Contact contact) {
        contact.setId(null);
        return repository.save(contact);
    }

    public Contact update(Long id, Contact changes) {
        Contact contact = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));
        contact.setName(changes.getName());
        contact.setEmail(changes.getEmail());
        contact.setCompany(changes.getCompany());
        contact.setPhone(changes.getPhone());
        contact.setCategory(changes.getCategory());
        return repository.save(contact);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found");
        }
        repository.deleteById(id);
    }
}