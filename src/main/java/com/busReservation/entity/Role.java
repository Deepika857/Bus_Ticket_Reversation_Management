package com.busReservation.entity;

public enum Role {
    ADMIN,
    CUSTOMER;

    public String getName() {
        return this.name();  
    }
}

