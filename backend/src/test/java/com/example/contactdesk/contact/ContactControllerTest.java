package com.example.contactdesk.contact;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void supportsContactCrudLifecycle() throws Exception {
        String contactJson = """
                {"name":"Avery Stone","email":"avery@example.com","company":"Northwind","phone":"+1 555 0100","category":"CLIENT"}
                """;

        MvcResult createResult = mockMvc.perform(post("/api/contacts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(contactJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Avery Stone"))
                .andReturn();
        JsonNode created = objectMapper.readTree(createResult.getResponse().getContentAsString());
        long id = created.get("id").asLong();

        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        String updatedJson = """
                {"name":"Avery Stone","email":"avery@northwind.example","company":"Northwind Studio","phone":"+1 555 0101","category":"PARTNER"}
                """;
        mockMvc.perform(put("/api/contacts/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("avery@northwind.example"))
                .andExpect(jsonPath("$.category").value("PARTNER"));

        mockMvc.perform(delete("/api/contacts/{id}", id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void rejectsInvalidContactData() throws Exception {
        String invalidContact = """
                {"name":"","email":"not-an-email","category":"CLIENT"}
                """;

        mockMvc.perform(post("/api/contacts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidContact))
                .andExpect(status().isBadRequest());
    }
}