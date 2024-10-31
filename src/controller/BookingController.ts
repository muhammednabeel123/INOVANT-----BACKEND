import { Request, Response } from 'express';
import { Booking } from '../entity/booking';
import { AppDataSource } from '../data-source';

// Get all bookings
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await AppDataSource.getRepository(Booking).find({where:{isDeleted:0}});
    res.status(200).json({ status: 200, message: 'Fetched bookings successfully', data: bookings });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error fetching bookings', error: error.message });
  }
};

// Create a new booking
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cust_name, cust_no, cust_email, booking_date, booking_time,members } = req.body;
    const booking = AppDataSource.getRepository(Booking).create({
      cust_name: cust_name,
      cust_no: cust_no,
      cust_email: cust_email, 
      members: members,
      booking_date: new Date(booking_date),
      booking_time: booking_time,
      visited: 0
    });
    const savedBooking = await AppDataSource.getRepository(Booking).save(booking);
    res.status(201).json({ status: 201, message: 'Booking created successfully', data: savedBooking });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error creating booking', error: error.message });
  }
};

export const updateVisitedStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const bookingRepository = AppDataSource.getRepository(Booking);
    const bookingToUpdate = await bookingRepository.findOne({ where: { id: bookingId } });

    if (!bookingToUpdate) {
      res.status(404).json({ status: 404, message: 'Booking not found' });
      return;
    }

    bookingToUpdate.visited = bookingToUpdate.visited === 0 ? 1 : 0;
    const updatedBooking = await bookingRepository.save(bookingToUpdate);
    res.status(200).json({ status: 200, message: 'Visited status updated successfully', data: updatedBooking });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error updating visited status', error: error.message });
  }
};

// Accept booking by admin
export const acceptBookingByAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const bookingRepository = AppDataSource.getRepository(Booking);
    const bookingToAccept = await bookingRepository.findOne({ where: { id: bookingId } });

    if (!bookingToAccept) {
      res.status(404).json({ status: 404, message: 'Booking not found' });
      return;
    }
    
    bookingToAccept.acceptedByAdmin = 1;

    const acceptedBooking = await bookingRepository.save(bookingToAccept);
    res.status(200).json({ status: 200, message: 'Booking accepted by admin successfully', data: acceptedBooking });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error accepting booking', error: error.message });
  }
}; 

// Edit booking
export const editBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const bookingRepository = AppDataSource.getRepository(Booking);
    const bookingToUpdate = await bookingRepository.findOne({ where: { id: bookingId } });

    if (!bookingToUpdate) {
      res.status(404).json({ status: 404, message: 'Booking not found' });
      return;
    }

    const { cust_name, cust_no, cust_email, booking_date, booking_time,members } = req.body;

    if (cust_name) bookingToUpdate.cust_name = cust_name;
    if (cust_no) bookingToUpdate.cust_no = cust_no;
    if (cust_email) bookingToUpdate.cust_email = cust_email;
    if (booking_date) bookingToUpdate.booking_date = new Date(booking_date);
    if (booking_time) bookingToUpdate.booking_time = booking_time;
    if (members) bookingToUpdate.members = members;

    const updatedBooking = await bookingRepository.save(bookingToUpdate);
    res.status(200).json({ status: 200, message: 'Booking updated successfully', data: updatedBooking });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error updating booking', error: error.message });
  }
};

// Delete booking
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const bookingRepository = AppDataSource.getRepository(Booking);
    const bookingToDelete = await bookingRepository.findOne({ where: { id: bookingId } });

    if (!bookingToDelete) {
      res.status(404).json({ status: 404, message: 'Booking not found' });
      return;
    }

    bookingToDelete.isDeleted = 1; 
    await bookingRepository.save(bookingToDelete);
    res.status(200).json({ status: 200, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error deleting booking', error: error.message });
  }
};
