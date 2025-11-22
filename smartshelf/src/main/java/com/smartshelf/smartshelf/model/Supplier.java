package com.smartshelf.smartshelf.model;

import jakarta.persistence.*;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String contactPerson;

    @Column(nullable = false)
    private String email;

    @Column
    private String phone;

    @Column
    private String leadTimeDays; // Estimated days for delivery

    @Column // <<< NEW FIELD: Financial term for payment
    private String paymentTerms;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLeadTimeDays() {
        return leadTimeDays;
    }

    public void setLeadTimeDays(String leadTimeDays) {
        this.leadTimeDays = leadTimeDays;
    }

    public String getPaymentTerms() { // <<< NEW GETTER
        return paymentTerms;
    }

    public void setPaymentTerms(String paymentTerms) { // <<< NEW SETTER
        this.paymentTerms = paymentTerms;
    }
}