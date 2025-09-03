package com.busReservation.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long busId;

    @Column(name = "bus_number", nullable = false, unique = true)
    private String busNumber;

    @Column(name = "bus_type", nullable = true)
    private String busType;

    @Column(name = "operator_name", nullable = true)
    private String operatorName;

    @Column(name = "total_seats", nullable = false)
    private int totalSeats;

    // Optional if capacity is redundant in your model, but keeping for consistency
    @Column(name = "capacity", nullable = false)
    private int capacity;
    
    @Column(name = "seat_rows", nullable = false)
    private int seatRows;

    @Column(name = "cols", nullable = false)
    private int cols;

    @Column(name = "seat_layout", nullable = false)
    private String seatLayout;

    @Column(name = "status", nullable = false)
    private String status; // Active or Inactive

    public Bus() {}

    // Getters and Setters

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

    public String getBusType() {
        return busType;
    }

    public void setBusType(String busType) {
        this.busType = busType;
    }

    public String getOperatorName() {
        return operatorName;
    }

    public void setOperatorName(String operatorName) {
        this.operatorName = operatorName;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getCols() {
        return cols;
    }

    public void setCols(int cols) {
        this.cols = cols;
    }

    public String getSeatLayout() {
        return seatLayout;
    }

    public void setSeatLayout(String seatLayout) {
        this.seatLayout = seatLayout;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    
    public int getSeatRows() {
    	return seatRows; 
    }
    public void setSeatRows(int seatRows) { this.seatRows = seatRows; }
}
