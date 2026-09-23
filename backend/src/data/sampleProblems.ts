import { ProblemProps } from '../domain/models/Problem';

export const SAMPLE_PROBLEMS: ProblemProps[] = [
  {
    id: 'parking-lot',
    title: 'Parking Lot Management System',
    shortDescription: 'Design a multi-level parking lot system handling spot assignment, vehicle types, pricing strategies, and entry/exit gates.',
    fullDescription: `
### Scenario
Design an automated parking lot system for a multi-story building. The system should manage entry and exit of vehicles, assign appropriate parking spots based on vehicle type, calculate fees dynamically using different pricing strategies, and handle real-time spot availability.

### System Requirements
1. **Vehicle Support:** Support multiple vehicle types: Motorcycle, Compact Car, Large SUV, Electric Vehicle, and Bus.
2. **Spot Allocation:** A spot can only fit an equal or larger vehicle type. Compact spots fit Compacts/Motorcycles; Large spots fit SUVs/Buses.
3. **Multi-Level Layout:** The lot consists of multiple floors, each containing various spot types.
4. **Pricing Strategies:** Support dynamic fee calculation: Flat Rate (hourly), Peak-Hour Pricing, or Vehicle-Specific Pricing (e.g. Electric charging fee surcharge).
5. **Entry & Exit Gates:** Multiple entry/exit gates issuing and validating tickets.

### Expected Deliverable
Model the core domain entities, interfaces, and relationships. Ensure SOLID principles are followed (especially SRP for spot finding vs fee calculation, and OCP for pricing strategies).
    `,
    difficulty: 'MEDIUM',
    category: 'Object-Oriented Design',
    tags: ['Strategy Pattern', 'Factory Pattern', 'Enum Handling', 'Domain Modeling'],
    requirements: [
      'Model Vehicle, ParkingSpot, Level, Ticket, and Gate entities.',
      'Implement an IPricingStrategy interface for extensible fee calculation.',
      'Support dynamic parking spot allocation strategy (e.g., nearest to entrance vs. floor balancing).',
      'Track total capacity and per-floor availability in real-time.'
    ],
    rubric: {
      expectedClasses: [
        { name: 'ParkingLot', type: 'class', description: 'Main domain aggregate for lot management' },
        { name: 'ParkingSpot', type: 'class', description: 'Represents an individual spot with status and size' },
        { name: 'Vehicle', type: 'class', description: 'Base class/entity for vehicles' },
        { name: 'Ticket', type: 'class', description: 'Issued upon entry, tracks arrival timestamp' },
        { name: 'VehicleType', type: 'enum', description: 'Enum specifying MOTORCYCLE, CAR, BUS, EV' },
        { name: 'IPricingStrategy', type: 'interface', description: 'Strategy interface for calculating parking fees' }
      ],
      expectedMethods: [
        { className: 'ParkingLot', methodName: 'parkVehicle', description: 'Assigns vehicle to available spot' },
        { className: 'ParkingLot', methodName: 'unparkVehicle', description: 'Frees spot and generates ticket fee' },
        { className: 'IPricingStrategy', methodName: 'calculateFee', description: 'Calculates monetary charge given a ticket' }
      ],
      recommendedPatterns: ['Strategy Pattern', 'Factory Pattern', 'Singleton Pattern'],
      keyDesignGoals: ['Extensible pricing rules', 'Proper spot size validation', 'Clean ticket abstraction'],
      commonAntiPatterns: ['God class combining pricing with spot search', 'Hardcoded switch statements for vehicle fees']
    },
    templates: {
      CODE_TS: {
        format: 'CODE_TS',
        code: `// Parking Lot Management System - TypeScript Starter Template

export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  COMPACT = 'COMPACT',
  LARGE = 'LARGE'
}

export abstract class Vehicle {
  constructor(public licensePlate: string, public type: VehicleType) {}
}

export class Car extends Vehicle {
  constructor(licensePlate: string) {
    super(licensePlate, VehicleType.COMPACT);
  }
}

export interface IPricingStrategy {
  calculateFee(entryTime: Date, exitTime: Date, type: VehicleType): number;
}

export class HourlyPricingStrategy implements IPricingStrategy {
  calculateFee(entryTime: Date, exitTime: Date, type: VehicleType): number {
    const hours = Math.ceil((exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60));
    return hours * 10;
  }
}

export class ParkingSpot {
  private isOccupied: boolean = false;
  private vehicle: Vehicle | null = null;

  constructor(public spotId: string, public spotType: VehicleType) {}

  public park(vehicle: Vehicle): boolean {
    if (this.isOccupied) return false;
    this.vehicle = vehicle;
    this.isOccupied = true;
    return true;
  }

  public unpark(): void {
    this.vehicle = null;
    this.isOccupied = false;
  }
}

export class ParkingLot {
  private spots: Map<string, ParkingSpot> = new Map();
  private pricingStrategy: IPricingStrategy;

  constructor(pricingStrategy: IPricingStrategy) {
    this.pricingStrategy = pricingStrategy;
  }

  public parkVehicle(vehicle: Vehicle): string | null {
    // TODO: Implement spot assignment logic
    return null;
  }

  public unparkVehicle(ticketId: string): number {
    // TODO: Free spot and calculate fee
    return 0;
  }
}
`
      },
      CODE_JAVA: {
        format: 'CODE_JAVA',
        code: `// Parking Lot Management System - Java Starter Template
import java.util.*;

public enum VehicleType { MOTORCYCLE, COMPACT, LARGE }

public abstract class Vehicle {
    private String licensePlate;
    private VehicleType type;

    public Vehicle(String licensePlate, VehicleType type) {
        this.licensePlate = licensePlate;
        this.type = type;
    }
}

public interface IPricingStrategy {
    double calculateFee(long durationHours, VehicleType type);
}

public class HourlyPricingStrategy implements IPricingStrategy {
    @Override
    public double calculateFee(long durationHours, VehicleType type) {
        return durationHours * 10.0;
    }
}

public class ParkingSpot {
    private String spotId;
    private VehicleType spotType;
    private boolean isOccupied;

    public ParkingSpot(String spotId, VehicleType spotType) {
        this.spotId = spotId;
        this.spotType = spotType;
    }
}

public class ParkingLot {
    private IPricingStrategy pricingStrategy;
    private List<ParkingSpot> spots = new ArrayList<>();

    public ParkingLot(IPricingStrategy pricingStrategy) {
        this.pricingStrategy = pricingStrategy;
    }

    public boolean parkVehicle(Vehicle vehicle) {
        // TODO: Implement vehicle parking algorithm
        return true;
    }

    public double unparkVehicle(String ticketId) {
        // TODO: Free spot and calculate charge
        return 0.0;
    }
}
`
      },
      CODE_PYTHON: {
        format: 'CODE_PYTHON',
        code: `# Parking Lot Management System - Python Starter Template
from abc import ABC, abstractmethod
from enum import Enum
from typing import List, Optional, Dict
import datetime

class VehicleType(Enum):
    MOTORCYCLE = "MOTORCYCLE"
    COMPACT = "COMPACT"
    LARGE = "LARGE"

class Vehicle(ABC):
    def __init__(self, license_plate: str, vehicle_type: VehicleType):
        self.license_plate = license_plate
        self.vehicle_type = vehicle_type

class Car(Vehicle):
    def __init__(self, license_plate: str):
        super().__init__(license_plate, VehicleType.COMPACT)

class IPricingStrategy(ABC):
    @abstractmethod
    def calculate_fee(self, duration_hours: float, vehicle_type: VehicleType) -> float:
        pass

class HourlyPricingStrategy(IPricingStrategy):
    def calculate_fee(self, duration_hours: float, vehicle_type: VehicleType) -> float:
        return duration_hours * 10.0

class ParkingSpot:
    def __init__(self, spot_id: str, spot_type: VehicleType):
        self.spot_id = spot_id
        self.spot_type = spot_type
        self.is_occupied = False
        self.vehicle: Optional[Vehicle] = None

    def park(self, vehicle: Vehicle) -> bool:
        if self.is_occupied:
            return False
        self.vehicle = vehicle
        self.is_occupied = True
        return True

    def unpark(self) -> None:
        self.vehicle = None
        self.is_occupied = False

class ParkingLot:
    def __init__(self, pricing_strategy: IPricingStrategy):
        self.pricing_strategy = pricing_strategy
        self.spots: Dict[str, ParkingSpot] = {}

    def park_vehicle(self, vehicle: Vehicle) -> Optional[str]:
        # TODO: Implement spot assignment logic
        return None

    def unpark_vehicle(self, ticket_id: str) -> float:
        # TODO: Free spot and calculate fee
        return 0.0
`
      },
      DIAGRAM_PLANTUML: {
        format: 'DIAGRAM_PLANTUML',
        code: `' Parking Lot Management System - PlantUML Class Diagram
@startuml

enum VehicleType {
  MOTORCYCLE
  COMPACT
  LARGE
}

abstract class Vehicle {
  - licensePlate: String
  - type: VehicleType
}

class Car extends Vehicle

interface IPricingStrategy {
  + calculateFee(entry: Date, exit: Date, type: VehicleType): double
}

class HourlyPricingStrategy implements IPricingStrategy {
  + calculateFee(entry: Date, exit: Date, type: VehicleType): double
}

class ParkingSpot {
  - spotId: String
  - spotType: VehicleType
  - isOccupied: boolean
  + park(v: Vehicle): boolean
  + unpark(): void
}

class Ticket {
  - ticketId: String
  - entryTime: Date
}

class ParkingLot {
  - pricingStrategy: IPricingStrategy
  + parkVehicle(v: Vehicle): String
  + unparkVehicle(ticketId: String): double
}

ParkingLot --> IPricingStrategy
ParkingLot "1" *-- "*" ParkingSpot
ParkingLot ..> Ticket

@enduml
`
      },
      TEXT: {
        format: 'TEXT',
        code: `PARKING LOT DESIGN DOCUMENTATION

1. Domain Classes:
- ParkingLot: Aggregate root managing floor levels and gate dispatch.
- ParkingSpot: Value object representing individual spots.
- Vehicle (Abstract) -> Motorcycle, Car, SUV.
- Ticket: Represents an active parking session.

2. Design Patterns Used:
- Strategy Pattern: IPricingStrategy for dynamic pricing.
- Factory Pattern: VehicleFactory for creating vehicle instances.
`
      }
    }
  },
  {
    id: 'elevator-system',
    title: 'Elevator Control System',
    shortDescription: 'Design an elevator controller for a multi-car high-rise building with request dispatching and state management.',
    fullDescription: `
### Scenario
Design an elevator management system for a 50-story commercial building with 6 elevator cars. The system must process hall calls (people waiting on floors) and car calls (buttons pressed inside elevators) efficiently.

### System Requirements
1. **Elevator Cars:** Track state: Idle, Moving Up, Moving Down, Maintenance.
2. **Dispatch Algorithm:** Implement an extensible elevator dispatch strategy (e.g. LOOK/SCAN algorithm, Nearest Car First).
3. **Door & Safety:** Model door state (Open, Closed, Obstruction) and weight limit sensors.
4. **Emergency Handling:** Handle emergency stop requests and power outage scenarios.
    `,
    difficulty: 'MEDIUM',
    category: 'State & Behavioral Design',
    tags: ['State Pattern', 'Command Pattern', 'Queue Dispatcher'],
    requirements: [
      'Model ElevatorCar, ElevatorController, InternalRequest, ExternalRequest, and Direction.',
      'Implement State Pattern for elevator movement transitions.',
      'Implement an IDispatchStrategy interface for elevator selection.'
    ],
    rubric: {
      expectedClasses: [
        { name: 'ElevatorCar', type: 'class', description: 'Represents physical elevator car state and floor position' },
        { name: 'ElevatorController', type: 'class', description: 'Central dispatcher assigning floor requests to cars' },
        { name: 'ElevatorState', type: 'enum', description: 'Enum: IDLE, MOVING_UP, MOVING_DOWN, MAINTENANCE' },
        { name: 'IDispatchStrategy', type: 'interface', description: 'Strategy interface for selecting optimal elevator' }
      ],
      expectedMethods: [
        { className: 'ElevatorController', methodName: 'requestElevator', description: 'Dispatches best elevator car for hall request' },
        { className: 'ElevatorCar', methodName: 'moveToFloor', description: 'Updates floor position and processes stops' }
      ],
      recommendedPatterns: ['State Pattern', 'Strategy Pattern', 'Observer Pattern'],
      keyDesignGoals: ['Decoupled request queue', 'Clear state transitions', 'Extensible scheduling algorithm'],
      commonAntiPatterns: ['Hardcoded state conditionals', 'God elevator class handling UI, hardware, and dispatching']
    },
    templates: {
      CODE_TS: {
        format: 'CODE_TS',
        code: `// Elevator Control System - TypeScript Starter Template

export enum ElevatorState { IDLE = 'IDLE', MOVING_UP = 'MOVING_UP', MOVING_DOWN = 'MOVING_DOWN', MAINTENANCE = 'MAINTENANCE' }
export enum Direction { UP = 'UP', DOWN = 'DOWN', NONE = 'NONE' }

export interface IDispatchStrategy {
  selectElevator(cars: ElevatorCar[], targetFloor: number, direction: Direction): ElevatorCar | null;
}

export class NearestCarStrategy implements IDispatchStrategy {
  selectElevator(cars: ElevatorCar[], targetFloor: number, direction: Direction): ElevatorCar | null {
    if (cars.length === 0) return null;
    return cars[0];
  }
}

export class ElevatorCar {
  public currentFloor: number = 1;
  public state: ElevatorState = ElevatorState.IDLE;

  constructor(public carId: string) {}

  public moveToFloor(floor: number): void {
    // TODO: State transition and floor position movement logic
    this.currentFloor = floor;
  }
}

export class ElevatorController {
  private cars: ElevatorCar[] = [];

  constructor(private dispatcher: IDispatchStrategy) {}

  public requestElevator(currentFloor: number, direction: Direction): boolean {
    const selected = this.dispatcher.selectElevator(this.cars, currentFloor, direction);
    if (selected) {
      selected.moveToFloor(currentFloor);
      return true;
    }
    return false;
  }
}
`
      },
      CODE_JAVA: {
        format: 'CODE_JAVA',
        code: `// Elevator Control System - Java Starter Template
import java.util.*;

public enum ElevatorState { IDLE, MOVING_UP, MOVING_DOWN, MAINTENANCE }
public enum Direction { UP, DOWN, NONE }

public interface IDispatchStrategy {
    ElevatorCar selectElevator(List<ElevatorCar> cars, int targetFloor, Direction direction);
}

public class NearestCarStrategy implements IDispatchStrategy {
    @Override
    public ElevatorCar selectElevator(List<ElevatorCar> cars, int targetFloor, Direction direction) {
        if (cars.isEmpty()) return null;
        return cars.get(0);
    }
}

public class ElevatorCar {
    private String carId;
    private int currentFloor = 1;
    private ElevatorState state = ElevatorState.IDLE;

    public ElevatorCar(String carId) {
        this.carId = carId;
    }

    public void moveToFloor(int floor) {
        this.currentFloor = floor;
    }

    public int getCurrentFloor() { return currentFloor; }
    public ElevatorState getState() { return state; }
}

public class ElevatorController {
    private List<ElevatorCar> cars = new ArrayList<>();
    private IDispatchStrategy dispatcher;

    public ElevatorController(IDispatchStrategy dispatcher) {
        this.dispatcher = dispatcher;
    }

    public boolean requestElevator(int currentFloor, Direction direction) {
        ElevatorCar selected = dispatcher.selectElevator(cars, currentFloor, direction);
        if (selected != null) {
            selected.moveToFloor(currentFloor);
            return true;
        }
        return false;
    }
}
`
      },
      CODE_PYTHON: {
        format: 'CODE_PYTHON',
        code: `# Elevator Control System - Python Starter Template
from abc import ABC, abstractmethod
from enum import Enum
from typing import List, Optional

class ElevatorState(Enum):
    IDLE = "IDLE"
    MOVING_UP = "MOVING_UP"
    MOVING_DOWN = "MOVING_DOWN"
    MAINTENANCE = "MAINTENANCE"

class Direction(Enum):
    UP = "UP"
    DOWN = "DOWN"
    NONE = "NONE"

class ElevatorCar:
    def __init__(self, car_id: str):
        self.car_id = car_id
        self.current_floor = 1
        self.state = ElevatorState.IDLE

    def move_to_floor(self, floor: int) -> None:
        self.current_floor = floor

class IDispatchStrategy(ABC):
    @abstractmethod
    def select_elevator(self, cars: List[ElevatorCar], target_floor: int, direction: Direction) -> Optional[ElevatorCar]:
        pass

class NearestCarStrategy(IDispatchStrategy):
    def select_elevator(self, cars: List[ElevatorCar], target_floor: int, direction: Direction) -> Optional[ElevatorCar]:
        if not cars:
            return None
        return cars[0]

class ElevatorController:
    def __init__(self, dispatcher: IDispatchStrategy):
        self.dispatcher = dispatcher
        self.cars: List[ElevatorCar] = []

    def request_elevator(self, current_floor: int, direction: Direction) -> bool:
        selected = self.dispatcher.select_elevator(self.cars, current_floor, direction)
        if selected:
            selected.move_to_floor(current_floor)
            return True
        return False
`
      },
      DIAGRAM_PLANTUML: {
        format: 'DIAGRAM_PLANTUML',
        code: `' Elevator Control System - PlantUML Class Diagram
@startuml

enum ElevatorState {
  IDLE
  MOVING_UP
  MOVING_DOWN
  MAINTENANCE
}

enum Direction {
  UP
  DOWN
  NONE
}

class ElevatorCar {
  - carId: String
  - currentFloor: int
  - state: ElevatorState
  + moveToFloor(floor: int): void
}

interface IDispatchStrategy {
  + selectElevator(cars: List<ElevatorCar>, floor: int, dir: Direction): ElevatorCar
}

class NearestCarStrategy implements IDispatchStrategy {
  + selectElevator(cars: List<ElevatorCar>, floor: int, dir: Direction): ElevatorCar
}

class ElevatorController {
  - dispatcher: IDispatchStrategy
  + requestElevator(currentFloor: int, dir: Direction): boolean
}

ElevatorController --> IDispatchStrategy
ElevatorController "1" *-- "*" ElevatorCar
ElevatorCar --> ElevatorState

@enduml
`
      },
      TEXT: {
        format: 'TEXT',
        code: `ELEVATOR CONTROL SYSTEM DESIGN DOCUMENTATION

1. Core Entities:
- ElevatorCar: Manages state transitions and current floor position.
- ElevatorController: Orchestrates hall calls and dispatches cars.
- ElevatorState (Enum): IDLE, MOVING_UP, MOVING_DOWN, MAINTENANCE.

2. Design Patterns Applied:
- State Pattern: Encapsulates elevator movement state behavior.
- Strategy Pattern: IDispatchStrategy for flexible car selection (SCAN / Nearest).
`
      }
    }
  },
  {
    id: 'vending-machine',
    title: 'Vending Machine State Machine',
    shortDescription: 'Design an automated vending machine with state transitions for item selection, payment, coin return, and dispensing.',
    fullDescription: `
### Scenario
Design the internal control software for an interactive vending machine that accepts cash/coins/cards, maintains inventory, and dispenses items.

### System Requirements
1. **States:** Ready/Idle, HasMoney, Dispensing, OutOfStock, CoinReturn.
2. **Transactions:** Handle exact change, refund request before purchase, and insufficient balance errors.
3. **Inventory:** Track item racks with aisle codes (A1, A2, B1), prices, and stock counts.
    `,
    difficulty: 'EASY',
    category: 'State Machine Design',
    tags: ['State Pattern', 'Inventory Management'],
    requirements: [
      'Model VendingMachine, State Interface (IVendingState), Inventory, Product, Coin.',
      'Implement complete State Pattern transitions for all machine states.'
    ],
    rubric: {
      expectedClasses: [
        { name: 'VendingMachine', type: 'class', description: 'Context aggregate root' },
        { name: 'IVendingState', type: 'interface', description: 'State interface for machine lifecycle operations' },
        { name: 'Inventory', type: 'class', description: 'Manages product stock per rack location' },
        { name: 'Product', type: 'class', description: 'Value object holding name, price, aisle code' }
      ],
      expectedMethods: [
        { className: 'IVendingState', methodName: 'insertCoin', description: 'Process coin insertion in current state' },
        { className: 'IVendingState', methodName: 'dispenseItem', description: 'Process product dispensing in current state' }
      ],
      recommendedPatterns: ['State Pattern'],
      keyDesignGoals: ['Strict state encapsulation', 'Transaction rollbacks on failure'],
      commonAntiPatterns: ['Nested switch-case statement explosion for state logic']
    },
    templates: {
      CODE_TS: {
        format: 'CODE_TS',
        code: `// Vending Machine State Machine - TypeScript Starter Template

export interface IVendingState {
  insertCoin(machine: VendingMachine, amount: number): void;
  selectProduct(machine: VendingMachine, code: string): void;
  dispenseItem(machine: VendingMachine): void;
}

export class Product {
  constructor(public name: string, public price: number, public code: string) {}
}

export class Inventory {
  private products: Map<string, Product> = new Map();
  private stock: Map<string, number> = new Map();

  public addProduct(product: Product, count: number): void {
    this.products.set(product.code, product);
    this.stock.set(product.code, count);
  }
}

export class VendingMachine {
  private currentState: IVendingState;
  private balance: number = 0;
  private inventory: Inventory = new Inventory();

  constructor(initialState: IVendingState) {
    this.currentState = initialState;
  }

  public insertCoin(amount: number): void {
    this.currentState.insertCoin(this, amount);
  }

  public dispenseItem(): void {
    this.currentState.dispenseItem(this);
  }
}
`
      },
      CODE_JAVA: {
        format: 'CODE_JAVA',
        code: `// Vending Machine State Machine - Java Starter Template
import java.util.*;

public interface IVendingState {
    void insertCoin(VendingMachine machine, double amount);
    void selectProduct(VendingMachine machine, String code);
    void dispenseItem(VendingMachine machine);
}

public class Product {
    private String name;
    private double price;
    private String code;

    public Product(String name, double price, String code) {
        this.name = name;
        this.price = price;
        this.code = code;
    }
}

public class Inventory {
    private Map<String, Product> products = new HashMap<>();
    private Map<String, Integer> stock = new HashMap<>();

    public void addProduct(Product p, int count) {
        products.put(p.getCode(), p);
        stock.put(p.getCode(), count);
    }
}

public class VendingMachine {
    private IVendingState currentState;
    private double balance = 0.0;
    private Inventory inventory = new Inventory();

    public VendingMachine(IVendingState initialState) {
        this.currentState = initialState;
    }

    public void insertCoin(double amount) {
        currentState.insertCoin(this, amount);
    }

    public void dispenseItem() {
        currentState.dispenseItem(this);
    }
}
`
      },
      CODE_PYTHON: {
        format: 'CODE_PYTHON',
        code: `# Vending Machine State Machine - Python Starter Template
from abc import ABC, abstractmethod
from typing import Dict

class Product:
    def __init__(self, name: str, price: float, code: str):
        self.name = name
        self.price = price
        self.code = code

class Inventory:
    def __init__(self):
        self.products: Dict[str, Product] = {}
        self.stock: Dict[str, int] = {}

    def add_product(self, product: Product, count: int) -> None:
        self.products[product.code] = product
        self.stock[product.code] = count

class IVendingState(ABC):
    @abstractmethod
    def insert_coin(self, machine: 'VendingMachine', amount: float) -> None:
        pass

    @abstractmethod
    def dispense_item(self, machine: 'VendingMachine') -> None:
        pass

class VendingMachine:
    def __init__(self, initial_state: IVendingState):
        self.current_state = initial_state
        self.balance: float = 0.0
        self.inventory = Inventory()

    def insert_coin(self, amount: float) -> None:
        self.current_state.insert_coin(self, amount)

    def dispense_item(self) -> None:
        self.current_state.dispense_item(self)
`
      },
      DIAGRAM_PLANTUML: {
        format: 'DIAGRAM_PLANTUML',
        code: `' Vending Machine - PlantUML Class Diagram
@startuml

interface IVendingState {
  + insertCoin(m: VendingMachine, amount: double): void
  + selectProduct(m: VendingMachine, code: String): void
  + dispenseItem(m: VendingMachine): void
}

class IdleState implements IVendingState
class HasMoneyState implements IVendingState
class DispensingState implements IVendingState

class Product {
  - name: String
  - price: double
  - code: String
}

class Inventory {
  - products: Map<String, Product>
  + addProduct(p: Product, count: int): void
}

class VendingMachine {
  - currentState: IVendingState
  - balance: double
  - inventory: Inventory
  + insertCoin(amount: double): void
  + dispenseItem(): void
}

VendingMachine --> IVendingState
VendingMachine "1" *-- "1" Inventory
Inventory "1" *-- "*" Product

@enduml
`
      },
      TEXT: {
        format: 'TEXT',
        code: `VENDING MACHINE STATE MACHINE DOCUMENTATION

1. Domain Architecture:
- VendingMachine: Context aggregate managing active state and transaction balance.
- IVendingState: Interface defining operations (insertCoin, selectProduct, dispenseItem).
- State Concrete Implementations: IdleState, HasMoneyState, DispensingState, OutOfStockState.
- Inventory & Product: Product catalog and stock level tracking.

2. Design Pattern Applied:
- State Pattern: Eliminates complex nested switch/if conditionals for state transitions.
`
      }
    }
  },
  {
    id: 'rate-limiter',
    title: 'Distributed Rate Limiter API',
    shortDescription: 'Design an in-memory/distributed rate limiter component supporting Sliding Window, Token Bucket, and Leaky Bucket algorithms.',
    fullDescription: `
### Scenario
Design a reusable rate limiting library used by HTTP gateway services to enforce client API quotas (e.g. 100 requests per minute per IP address).

### System Requirements
1. **Algorithms:** Support multiple rate-limiting algorithms: Token Bucket, Fixed Window, and Sliding Window Log.
2. **Client Identification:** Limit by Client IP, User ID, or API Key.
3. **Concurrency:** Design abstractions assuming thread-safe or atomic bucket updates.
    `,
    difficulty: 'HARD',
    category: 'High-Performance Systems',
    tags: ['Strategy Pattern', 'Sliding Window', 'Concurrency'],
    requirements: [
      'Model RateLimiter, IRateLimitStrategy, TokenBucket, ClientIdentifier.',
      'Implement IRateLimitStrategy for plugging in different algorithms.'
    ],
    rubric: {
      expectedClasses: [
        { name: 'RateLimiter', type: 'class', description: 'Facade class evaluating request admission' },
        { name: 'IRateLimitStrategy', type: 'interface', description: 'Strategy interface for rate-limiting algorithms' },
        { name: 'TokenBucket', type: 'class', description: 'Implementation of token bucket algorithm' }
      ],
      expectedMethods: [
        { className: 'RateLimiter', methodName: 'allowRequest', description: 'Returns boolean whether request is permitted' },
        { className: 'IRateLimitStrategy', methodName: 'isAllowed', description: 'Algorithm check given client key' }
      ],
      recommendedPatterns: ['Strategy Pattern', 'Facade Pattern'],
      keyDesignGoals: ['Algorithm pluggability', 'Low latency evaluation'],
      commonAntiPatterns: ['Global state locking blocking all clients']
    },
    templates: {
      CODE_TS: {
        format: 'CODE_TS',
        code: `// Distributed Rate Limiter API - TypeScript Starter Template

export interface IRateLimitStrategy {
  isAllowed(clientId: string): boolean;
}

export class TokenBucket implements IRateLimitStrategy {
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(private capacity: number, private refillRatePerSec: number) {
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  public isAllowed(clientId: string): boolean {
    // TODO: Token bucket algorithm implementation
    return true;
  }
}

export class RateLimiter {
  constructor(private strategy: IRateLimitStrategy) {}

  public allowRequest(clientId: string): boolean {
    return this.strategy.isAllowed(clientId);
  }
}
`
      },
      CODE_JAVA: {
        format: 'CODE_JAVA',
        code: `// Distributed Rate Limiter API - Java Starter Template
import java.util.*;

public interface IRateLimitStrategy {
    boolean isAllowed(String clientId);
}

public class TokenBucket implements IRateLimitStrategy {
    private final int capacity;
    private final double refillRatePerSec;
    private double tokens;
    private long lastRefillTimestamp;

    public TokenBucket(int capacity, double refillRatePerSec) {
        this.capacity = capacity;
        this.refillRatePerSec = refillRatePerSec;
        this.tokens = capacity;
        this.lastRefillTimestamp = System.currentTimeMillis();
    }

    @Override
    public boolean isAllowed(String clientId) {
        // TODO: Token bucket algorithm logic
        return true;
    }
}

public class RateLimiter {
    private IRateLimitStrategy strategy;

    public RateLimiter(IRateLimitStrategy strategy) {
        this.strategy = strategy;
    }

    public boolean allowRequest(String clientId) {
        return strategy.isAllowed(clientId);
    }
}
`
      },
      CODE_PYTHON: {
        format: 'CODE_PYTHON',
        code: `# Distributed Rate Limiter API - Python Starter Template
from abc import ABC, abstractmethod
import time

class IRateLimitStrategy(ABC):
    @abstractmethod
    def is_allowed(self, client_id: str) -> bool:
        pass

class TokenBucket(IRateLimitStrategy):
    def __init__(self, capacity: int, refill_rate_per_sec: float):
        self.capacity = capacity
        self.refill_rate_per_sec = refill_rate_per_sec
        self.tokens = float(capacity)
        self.last_refill_timestamp = time.time()

    def is_allowed(self, client_id: str) -> bool:
        # TODO: Implement token bucket algorithm
        return True

class RateLimiter:
    def __init__(self, strategy: IRateLimitStrategy):
        self.strategy = strategy

    def allow_request(self, client_id: str) -> bool:
        return self.strategy.is_allowed(client_id)
`
      },
      DIAGRAM_PLANTUML: {
        format: 'DIAGRAM_PLANTUML',
        code: `' Distributed Rate Limiter API - PlantUML Class Diagram
@startuml

interface IRateLimitStrategy {
  + isAllowed(clientId: String): boolean
}

class TokenBucket implements IRateLimitStrategy {
  - capacity: int
  - refillRatePerSec: double
  - tokens: double
  + isAllowed(clientId: String): boolean
}

class SlidingWindowLog implements IRateLimitStrategy {
  - windowSizeMs: long
  + isAllowed(clientId: String): boolean
}

class RateLimiter {
  - strategy: IRateLimitStrategy
  + allowRequest(clientId: String): boolean
}

RateLimiter --> IRateLimitStrategy

@enduml
`
      },
      TEXT: {
        format: 'TEXT',
        code: `DISTRIBUTED RATE LIMITER API DOCUMENTATION

1. Architectural Components:
- RateLimiter: Gateway facade evaluating HTTP client admission.
- IRateLimitStrategy: Interface for rate limiting algorithms (TokenBucket, SlidingWindowLog).
- TokenBucket: Implementation tracking token refill and capacity.

2. Design Patterns Applied:
- Strategy Pattern: Enables runtime selection of rate limiting algorithm per route/tier.
- Facade Pattern: RateLimiter simplifies underlying algorithm complexity for client callers.
`
      }
    }
  }
];
