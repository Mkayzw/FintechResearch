# Scientific Foundation

## Coordinate convention

The model uses absolute angles $\theta_1$ and $\theta_2$, measured clockwise from the downward vertical. With the pivot at the origin and screen-independent Cartesian coordinates where positive $y$ points upward,

$$
x_1=l_1\sin\theta_1,\qquad y_1=-l_1\cos\theta_1,
$$

$$
x_2=x_1+l_2\sin\theta_2,\qquad y_2=y_1-l_2\cos\theta_2.
$$

This convention is displayed in the product because double-pendulum literature also uses relative second-link angles. Mixing conventions silently changes the equations.

## Energies and Lagrangian

Let $\Delta=\theta_1-\theta_2$ and $\omega_i=\dot\theta_i$. The kinetic and potential energies are

$$
T=\frac12(m_1+m_2)l_1^2\omega_1^2
 +\frac12m_2l_2^2\omega_2^2
 +m_2l_1l_2\omega_1\omega_2\cos\Delta,
$$

$$
V=-(m_1+m_2)gl_1\cos\theta_1-m_2gl_2\cos\theta_2.
$$

The Lagrangian is $\mathcal L=T-V$ and mechanical energy is $E=T+V$.

Applying

$$
\frac{d}{dt}\frac{\partial\mathcal L}{\partial\dot\theta_i}
-\frac{\partial\mathcal L}{\partial\theta_i}=0
$$

gives a compact manipulator form,

$$
M(\theta)\ddot\theta+h(\theta,\dot\theta)=0,
$$

with

$$
M=
\begin{bmatrix}
(m_1+m_2)l_1^2 & m_2l_1l_2\cos\Delta\\
m_2l_1l_2\cos\Delta & m_2l_2^2
\end{bmatrix},
$$

$$
h=
\begin{bmatrix}
m_2l_1l_2\sin\Delta\,\omega_2^2+(m_1+m_2)gl_1\sin\theta_1\\
-m_2l_1l_2\sin\Delta\,\omega_1^2+m_2gl_2\sin\theta_2
\end{bmatrix}.
$$

The implementation solves this two-dimensional linear system at every derivative evaluation and then integrates the first-order state

$$
\dot y=(\omega_1,\omega_2,\ddot\theta_1,\ddot\theta_2)^T.
$$

## Sensitive dependence

For two states $y(t)$ and $y'(t)$, the application defines a dimensionless distance using shortest wrapped angular differences and angular velocities scaled by the natural time $\tau=\sqrt{l_\mathrm{ref}/g}$:

$$
d(t)=\sqrt{\delta\theta_1^2+\delta\theta_2^2+
(\tau\delta\omega_1)^2+(\tau\delta\omega_2)^2}.
$$

An initially straight interval in $\log(d(t)/d(0))$ suggests finite-time exponential separation. A slope fitted to a hand-picked finite interval is not automatically the system's asymptotic largest Lyapunov exponent; the interface uses cautious terminology.

## Numerical interpretation

RK4 is transparent and appropriate for interactive fixed-step integration. Euler is included only as a numerical foil. A conservative model's true mechanical energy is constant, but finite-step solvers introduce energy error. The interface reports

$$
E_{\mathrm{scale}}=(m_1+m_2)gl_1+m_2gl_2,
\qquad \varepsilon_E=\frac{E(t)-E(0)}{E_{\mathrm{scale}}}.
$$

This fixed gravitational scale avoids dependence on an arbitrary potential-energy zero and remains well behaved when $E(0)\approx0$. Energy conservation alone does not prove trajectory correctness, especially after chaotic trajectories separate, so the study also emphasizes timestep refinement and short-time cross-method agreement.

## Reproducible experiments

### E1 — Quiet orbit

Small angles and zero velocities establish a nearly regular baseline. Observe periodic-looking angle histories, compact phase curves, and small energy drift.

### E2 — Butterfly effect

Duplicate a high-energy initial state and perturb $\theta_2$ by a documented small amount. Observe overlap, exponential-looking early separation, then saturation at system scale.

### E3 — Energy exchange

Choose conditions where energy visibly transfers between links. Track kinetic, potential, and total energy while the bobs exchange motion.

### E4 — Solver stress

Apply the same timestep to Euler and RK4. Compare total-energy error and trajectory quality. Repeat after reducing the timestep.

## Validation checklist

- Downward and upright zero-velocity equilibria have zero acceleration.
- $M$ is symmetric and positive definite for positive physical parameters.
- Independently computed energy remains approximately constant under sufficiently fine RK4 integration.
- RK4 shows fourth-order convergence in a smooth short-time experiment before roundoff dominates.
- Timestep refinement stabilizes early-time divergence conclusions.
- Identical initial states remain identical deterministically.
- Display coordinates do not leak into physics coordinates.

## Bibliography

1. Shinbrot, T., Grebogi, C., Wisdom, J., & Yorke, J. A. (1992). Chaos in a double pendulum. *American Journal of Physics, 60*, 491–499. https://doi.org/10.1119/1.16860
2. Stachowiak, T., & Okada, T. (2006). A numerical analysis of chaos in the double pendulum. *Chaos, Solitons & Fractals, 29*, 417–422. https://doi.org/10.1016/j.chaos.2005.08.032
3. Dormand, J. R., & Prince, P. J. (1980). A family of embedded Runge–Kutta formulae. *Journal of Computational and Applied Mathematics, 6*, 19–26. https://doi.org/10.1016/0771-050X(80)90013-3
4. Wolfram ScienceWorld. Double Pendulum. https://scienceworld.wolfram.com/physics/DoublePendulum.html
5. SciPy. `solve_ivp` reference. https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_ivp.html
