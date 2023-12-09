using Car_Rental_System.Models;

namespace Car_Rental_System.ViewModel
{
    public class HomeViewModel
    {
        public class DescendingComparer : IComparer<string>
        {
            public int Compare(string x, string y)
            {
                return y.CompareTo(x);
            }
        }
        public List<Vehicle> Vehicles { get; set; }

        public Booking BookCar { get; set; }
        public Vehicle Transport { get; set; }

        public SortedDictionary<string,List<Car>> CarsSortedOnModelYear { get; set; }

        public HomeViewModel()
        {
            Vehicles = new List<Vehicle>();
            BookCar = new Booking();
            Transport = new Vehicle();
            CarsSortedOnModelYear = new SortedDictionary<string, List<Car>>(new DescendingComparer());
        }
    }
}
