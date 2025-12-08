# Nuclear Desalination Financing Calculator

An interactive JavaScript calculator for evaluating the economic feasibility of converting existing coastal nuclear power plants into desalination facilities using Multi-Effect Distillation (MED) technology.

## Overview

This calculator is based on the IAEA DEEP 5.1 (Desalination Economic Evaluation Program) methodology and implements formulas for calculating daily fresh water production from nuclear waste heat recovery.

## Key Features

- **Waste Heat Recovery**: Captures 67% of reactor thermal power typically lost through cooling towers
- **MED System Calculations**: Multi-Effect Distillation with configurable Gain Output Ratio (GOR)
- **Economic Analysis**: Complete financial modeling including NPV, payback period, and cost per cubic meter
- **Earthgrid Integration**: Includes costs for deep boring technology for waste disposal and fuel transport tunnels
- **Financing Proposals**: Auto-generated executive summaries for investment proposals

## Daily Fresh Water Production Formula

The core formula implemented in this calculator:

```
Daily Water (m³/day) = (Waste Heat × 24 × 3600 × MED Efficiency) / (Latent Heat × 1000)
```

Where:
- **Waste Heat** = Reactor Power (MWth) × Waste Heat Factor (%) / 100
- **MED Efficiency** = GOR (Gain Output Ratio) - typically 8-15 for MED systems
- **Latent Heat** = ~2326 kJ/kg (at 70°C)
- **24** = Hours per day
- **3600** = Seconds per hour

### Formula Breakdown

1. **Waste Heat Available**: 
   - Typically 67% of reactor thermal power is recoverable waste heat
   - Example: 3000 MWth reactor → 2010 MWth waste heat available

2. **Energy Conversion**:
   - Waste Heat (MW) × 24 hours × 3600 seconds = Daily thermal energy (kJ/day)
   - Multiply by GOR to get effective energy for desalination

3. **Water Production**:
   - Divide by latent heat of vaporization (2326 kJ/kg)
   - Convert from kg to m³ (divide by 1000)

## Research Background

### Nuclear Desalination Feasibility

Multiple studies confirm the technical and economic viability of using nuclear waste heat for desalination:

1. **Advanced Multi-Effect Distillation (AMED)**: Research demonstrates that waste heat from nuclear reactors can drive MED systems without affecting power generation efficiency.

2. **Low-Temperature Desalination**: Studies show that recovering waste heat from nuclear plant condensers can power low-temperature desalination systems, producing significant quantities of potable water.

3. **Operational Examples**:
   - **Kalpakkam, India**: Nuclear Desalination Demonstration Project with 4,500 m³/day MSF and 1,800 m³/day RO units
   - **Fujairah F1 IWPP, UAE**: 455,000 m³/day desalination capacity
   - **Jebel Ali, UAE**: 2.228 million m³/day desalination capacity

### IAEA DEEP 5.1

The International Atomic Energy Agency's Desalination Economic Evaluation Program (DEEP) 5.1 is a comprehensive tool for:
- Economic evaluation of nuclear desalination projects
- Thermodynamic analysis and optimization
- Comparison of different plant configurations
- Cash flow analysis for feasibility studies

This calculator modernizes the DEEP 5.1 Excel application into an interactive web-based tool.

## Usage

1. Open `calculator.html` in a web browser
2. Enter plant configuration parameters:
   - Reactor thermal power output
   - Waste heat utilization factor (default: 67%)
   - MED system efficiency (GOR)
   - Number of MED effects
   - Top brine temperature
3. Configure economic parameters:
   - Water sale price
   - Capital costs
   - Retrofit multipliers
4. Set Earthgrid boring technology parameters:
   - Tunnel lengths for waste disposal and fuel transport
   - Boring costs per kilometer
5. Click "Calculate Desalination Economics" to view results

## Input Parameters

### Plant Configuration
- **Reactor Thermal Power**: Total thermal output in MWth
- **Waste Heat Utilization Factor**: Percentage of thermal power available for desalination (typically 67%)
- **MED System Efficiency (GOR)**: Gain Output Ratio - ratio of distillate to steam consumed (typical: 8-15)
- **Number of MED Effects**: Number of evaporation stages (typical: 4-16)
- **Top Brine Temperature**: Maximum operating temperature in °C (typical: 50-90°C)
- **Plant Availability Factor**: Operational availability percentage (typical: 80-95%)

### Economic Parameters
- **Water Sale Price**: Revenue per cubic meter of desalinated water
- **MED System Capital Cost**: Cost per m³/day of production capacity
- **Retrofit Cost Multiplier**: Additional cost factor for retrofitting existing infrastructure

### Earthgrid Boring Technology
- **Waste Disposal Tunnel Length**: Length of deep disposal tunnels in km
- **Fuel Transport Tunnel Length**: Length of fuel transport tunnels in km
- **Boring Cost per Kilometer**: Cost per km of tunnel construction
- **Nuclear Plant Purchase Price**: Acquisition cost of existing plant

## Output Metrics

### Water Production
- Daily fresh water production (m³/day)
- Annual water production (m³/year)
- Water production per MWth per day
- Waste heat available for desalination

### Financial Analysis
- Annual water revenue
- Total project costs (plant purchase + retrofit + boring)
- Payback period
- 20-year Net Present Value (NPV) at 10% discount rate
- Cost per cubic meter of water

### Energy Metrics
- Thermal energy per cubic meter
- Specific energy consumption

## Technical Notes

### MED System Efficiency

The Gain Output Ratio (GOR) is a key parameter:
- **GOR = Mass of distillate / Mass of steam consumed**
- Higher GOR indicates better efficiency
- Typical MED systems achieve GOR of 8-15
- GOR increases with number of effects and proper temperature distribution

### Waste Heat Recovery

Nuclear reactors typically operate at ~33% thermal efficiency:
- 33% converted to electricity
- 67% rejected as waste heat through cooling systems
- This waste heat can be captured for desalination without affecting power generation

### Energy Requirements

MED systems require thermal energy for:
- Heating feedwater to top brine temperature
- Providing latent heat for evaporation
- The GOR accounts for the efficiency of heat reuse across multiple effects

## References

1. IAEA DEEP 5.1 Manual: Desalination Economic Evaluation Program
2. "Advanced Multi-Effect Distillation System for Desalination Using Waste Heat from Gas Brayton Cycles" - OSTI
3. "Low-Temperature Desalination Driven by Waste Heat of Nuclear Power Plants" - ScienceDirect
4. IAEA Nuclear Desalination Program
5. Kalpakkam Nuclear Desalination Demonstration Project

## License

This calculator is provided as an open-source tool for evaluating nuclear desalination projects. Based on IAEA DEEP 5.1 methodology.

## Contact

For questions or contributions, please refer to the project repository.
